import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhopAuthRequest {
  whop_user_id: string;
  whop_access_pass?: string;
  whop_plan_id?: string;
  email?: string;
  username?: string;
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

    const { whop_user_id, whop_access_pass, whop_plan_id, email, username }: WhopAuthRequest = await req.json();

    if (!whop_user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing whop_user_id' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check if user already exists with this Whop ID
    const { data: existingProfile } = await supabaseClient
      .from('profiles')
      .select('id, email')
      .eq('whop_user_id', whop_user_id)
      .single();

    if (existingProfile) {
      // User exists, return their info
      return new Response(
        JSON.stringify({ 
          success: true, 
          user_id: existingProfile.id,
          email: existingProfile.email,
          exists: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Create new user if email is provided
    if (email) {
      // Generate a temporary password for Whop users
      const tempPassword = crypto.randomUUID();
      
      // Create auth user
      const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          source: 'whop',
          whop_user_id,
          username: username || email.split('@')[0]
        }
      });

      if (authError) {
        console.error('Auth user creation failed:', authError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }

      // Update profile with Whop data
      if (authUser.user) {
        await supabaseClient
          .from('profiles')
          .update({
            whop_user_id,
            whop_subscription_id: whop_access_pass,
            whop_plan_id,
            source: 'whop'
          })
          .eq('id', authUser.user.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            user_id: authUser.user.id,
            email: authUser.user.email,
            exists: false 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'User not found and no email provided for creation' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404 
      }
    );

  } catch (error) {
    console.error('Whop auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});