import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const startTime = Date.now();
  console.log("🚀 API analyze-document function started");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for API key in Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Validate API key and get user
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: keyData, error: keyError } = await supabaseAdmin
      .from('api_keys')
      .select('user_id, is_active, usage_count')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (keyError || !keyData) {
      console.error("Invalid API key:", keyError);
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limits (basic implementation)
    const userId = keyData.user_id;
    
    // Get user's subscription plan to check limits
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('document_limit, document_count')
      .eq('id', userId)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has reached their limit
    if (profile.document_count >= profile.document_limit) {
      return new Response(
        JSON.stringify({ 
          error: 'Document limit reached',
          message: `You have reached your plan limit of ${profile.document_limit} documents` 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process formData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only PDF and Word documents are supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call the existing analyze-document function
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    });

    const response = await supabaseUser.functions.invoke('analyze-document', {
      body: formData,
      headers: {
        'x-api-user-id': userId,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Analysis failed");
    }

    // Update API key usage
    await supabaseAdmin
      .from('api_keys')
      .update({ 
        usage_count: keyData.usage_count + 1,
        last_used: new Date().toISOString()
      })
      .eq('key', apiKey);

    // Log API usage
    await supabaseAdmin
      .from('api_usage')
      .insert({
        user_id: userId,
        endpoint: '/api-analyze-document',
        method: 'POST',
        status: 'success',
        response_time_ms: Date.now() - startTime,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    const totalTime = Date.now() - startTime;
    console.log(`🎉 API processing complete in ${totalTime}ms`);
    
    return new Response(
      JSON.stringify({
        ...response.data,
        processing_time_ms: totalTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`💥 API error after ${totalTime}ms:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred: ' + (error.message || String(error)),
        processing_time_ms: totalTime
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});