
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the email from the request
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create the table if it doesn't exist
    // This would normally be done in a migration, but for simplicity we'll do it here
    const { error: createTableError } = await supabase.rpc('create_newsletter_subscribers_if_not_exists');

    // Check if email already exists
    const { data: existingSubscriber, error: queryError } = await supabase.rpc('check_newsletter_subscriber', { email_to_check: email });

    if (queryError) {
      console.error('Error checking existing subscriber:', queryError);
      return new Response(
        JSON.stringify({ error: 'Error checking existing subscriber' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (existingSubscriber && existingSubscriber.exists) {
      return new Response(
        JSON.stringify({ message: 'Already subscribed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Insert the new subscriber
    const { error: insertError } = await supabase.rpc('insert_newsletter_subscriber', { 
      subscriber_email: email,
      subscription_date: new Date().toISOString()
    });

    if (insertError) {
      console.error('Error subscribing:', insertError);
      return new Response(
        JSON.stringify({ error: 'Error subscribing to newsletter' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Successfully subscribed to newsletter' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
