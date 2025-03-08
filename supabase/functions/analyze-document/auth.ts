
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export async function handleAuthentication(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  const token = authHeader.replace('Bearer ', '');
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false }
  });

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // Get user from token
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
  
  if (userError || !user) {
    console.error("Auth error:", userError);
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  return {
    success: true,
    user,
    supabaseClient,
    adminClient
  };
}
