
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get current date and date for tomorrow
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format dates for SQL query - get redemptions expiring in the next 24 hours
    const nowStr = now.toISOString();
    const tomorrowStr = tomorrow.toISOString();
    
    // Query for expiring redemptions
    const { data: expiringRedemptions, error: redemptionError } = await supabase
      .from('code_redemptions')
      .select(`
        id,
        user_id,
        expires_at,
        redemption_codes (
          code,
          plan_type
        )
      `)
      .gte('expires_at', nowStr)
      .lt('expires_at', tomorrowStr);
    
    if (redemptionError) {
      throw redemptionError;
    }
    
    if (!expiringRedemptions || expiringRedemptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No expiring trials found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Process each expiring redemption
    const notifications = [];
    
    for (const redemption of expiringRedemptions) {
      // Get user email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', redemption.user_id)
        .single();
      
      if (userError || !userData) {
        console.error(`Could not find user: ${redemption.user_id}`, userError);
        continue;
      }
      
      // Here you would typically send an email notification
      // For now we'll just log it
      const notificationData = {
        userId: redemption.user_id,
        email: userData.email,
        expiresAt: redemption.expires_at,
        planType: redemption.redemption_codes?.plan_type,
        message: `Your ${redemption.redemption_codes?.plan_type} trial is expiring soon. Please upgrade your plan to continue using premium features.`
      };
      
      notifications.push(notificationData);
      
      // In a real system, we'd send emails here
      console.log(`Trial expiry notification for ${userData.email}: Expires on ${redemption.expires_at}`);
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Processed ${notifications.length} expiring trials`,
        notifications 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in check-expiring-trials function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
