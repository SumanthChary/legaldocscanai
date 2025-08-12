import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const PAYPAL_API_URL = 'https://api-m.paypal.com'; // Change to sandbox URL for testing
const PAYPAL_CLIENT_ID = 'AZiHrC_GIm4eru7Ql0zgdwXuBv9tWhcL-WE1ZQyCIBIKGFvGWTt5r9IcPXrkVm8fWlDhzRuMF9IGBD0_';
const PAYPAL_SECRET = 'EM5CnMkNyCZN9JychYoEFTPA1o5S7T6dgWptoIxvzei1O9A_v3aYVdXSJIlNPb7l5BHHzJsCbYzyiGc8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function getPayPalAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`);
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

async function verifyPayPalPayment(orderId: string, accessToken: string) {
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const requestCounts = new Map();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(userId) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  validRequests.push(now);
  requestCounts.set(userId, validRequests);
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // Add request timestamp tracking for rate limiting
  const requestTimestamp = new Date().toISOString();

  try {
    const { orderId, userId, planType, amount } = await req.json();

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many requests. Please try again later.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    // Validate required parameters
    if (!orderId || !userId || !planType) {
      throw new Error('Missing required parameters');
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Verify the payment with PayPal
    const paymentDetails = await verifyPayPalPayment(orderId, accessToken);
    
    if (paymentDetails.status !== 'COMPLETED') {
      throw new Error('Payment not completed');
    }

    // Verify payment amount matches expected amount
    const paidAmount = paymentDetails.purchase_units[0].amount.value;
    if (paidAmount !== amount) {
      throw new Error('Payment amount mismatch');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate subscription period
    const now = new Date();
    const periodEnd = new Date(now.setMonth(now.getMonth() + 1));

    // Update subscription in database
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
        payment_provider: 'paypal',
        payment_id: orderId,
      });

    if (subscriptionError) {
      throw subscriptionError;
    }

    // Update user's document limit based on plan
    const newLimit = planType === 'professional' ? 500 : planType === 'enterprise' ? 999999 : 25;
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ document_limit: newLimit })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment processed successfully',
        subscription: {
          status: 'active',
          planType,
          currentPeriodEnd: periodEnd.toISOString(),
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Payment processing failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
