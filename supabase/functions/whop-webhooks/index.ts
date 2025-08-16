import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhopWebhookData {
  type: string;
  data: {
    user_id?: string;
    subscription?: {
      id: string;
      plan_id: string;
      status: string;
      current_period_start: string;
      current_period_end: string;
    };
    access_pass?: {
      id: string;
      plan_id: string;
    };
    plan_id?: string;
  };
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookData: WhopWebhookData = await req.json();
    
    // Log the webhook event
    const { error: logError } = await supabaseClient
      .from('whop_webhooks')
      .insert({
        event_type: webhookData.type,
        whop_user_id: webhookData.data.user_id || 'unknown',
        whop_subscription_id: webhookData.data.subscription?.id || webhookData.data.access_pass?.id,
        whop_plan_id: webhookData.data.subscription?.plan_id || webhookData.data.plan_id || webhookData.data.access_pass?.plan_id,
        event_data: webhookData.data,
        processed: false
      });

    if (logError) {
      console.error('Failed to log webhook:', logError);
    }

    // Process the webhook based on type
    switch (webhookData.type) {
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionEvent(supabaseClient, webhookData);
        break;
      
      case 'subscription.canceled':
        await handleSubscriptionCancellation(supabaseClient, webhookData);
        break;
      
      case 'user.access_granted':
        await handleAccessGranted(supabaseClient, webhookData);
        break;
      
      case 'user.access_revoked':
        await handleAccessRevoked(supabaseClient, webhookData);
        break;
      
      default:
        console.log(`Unhandled webhook type: ${webhookData.type}`);
    }

    // Mark webhook as processed
    await supabaseClient
      .from('whop_webhooks')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('whop_user_id', webhookData.data.user_id || 'unknown')
      .eq('event_type', webhookData.type);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function handleSubscriptionEvent(supabaseClient: any, webhookData: WhopWebhookData) {
  const { data: subscription } = webhookData;
  
  if (!subscription.user_id || !subscription.subscription) {
    console.error('Missing required subscription data');
    return;
  }

  // Map Whop plan to internal plan type
  const planTypeMap: Record<string, string> = {
    'entrepreneur_shield': 'professional',
    'business_guardian': 'professional', 
    'legal_command_center': 'enterprise',
    'lifetime_power_pack': 'enterprise'
  };

  const planType = planTypeMap[subscription.subscription.plan_id] || 'professional';

  // Find user by Whop user ID or create if needed
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('id')
    .eq('whop_user_id', subscription.user_id)
    .single();

  if (profile) {
    // Sync subscription data
    await supabaseClient.rpc('sync_whop_subscription', {
      p_user_id: profile.id,
      p_whop_user_id: subscription.user_id,
      p_whop_subscription_id: subscription.subscription.id,
      p_whop_plan_id: subscription.subscription.plan_id,
      p_plan_type: planType,
      p_status: subscription.subscription.status,
      p_current_period_start: subscription.subscription.current_period_start,
      p_current_period_end: subscription.subscription.current_period_end
    });
  }
}

async function handleSubscriptionCancellation(supabaseClient: any, webhookData: WhopWebhookData) {
  const { data } = webhookData;
  
  if (!data.user_id) {
    console.error('Missing user_id for cancellation');
    return;
  }

  // Update subscription status
  await supabaseClient
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('whop_user_id', data.user_id);
}

async function handleAccessGranted(supabaseClient: any, webhookData: WhopWebhookData) {
  const { data } = webhookData;
  
  if (!data.user_id || !data.access_pass) {
    console.error('Missing required access data');
    return;
  }

  // Update user access
  await supabaseClient
    .from('profiles')
    .update({ 
      whop_subscription_id: data.access_pass.id,
      whop_plan_id: data.access_pass.plan_id 
    })
    .eq('whop_user_id', data.user_id);
}

async function handleAccessRevoked(supabaseClient: any, webhookData: WhopWebhookData) {
  const { data } = webhookData;
  
  if (!data.user_id) {
    console.error('Missing user_id for access revocation');
    return;
  }

  // Revoke access
  await supabaseClient
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('whop_user_id', data.user_id);
}