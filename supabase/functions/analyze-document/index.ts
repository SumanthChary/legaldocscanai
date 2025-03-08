
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { handleAuthentication } from "./auth.ts";
import { checkDocumentLimits } from "./limits.ts";
import { validateFileUpload } from "./file-validation.ts";
import { processDocument } from "./document-processor.ts";
import { corsHeaders } from "./cors.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authResult = await handleAuthentication(req);
    if (!authResult.success) {
      return authResult.response;
    }
    
    const { user, supabaseClient, adminClient } = authResult;
    console.log("User authenticated:", user.id);

    // Check document limits for user
    const limitResult = await checkDocumentLimits(supabaseClient, user.id);
    if (!limitResult.success) {
      return limitResult.response;
    }

    // Process the formData and validate file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    const fileValidation = validateFileUpload(file);
    if (!fileValidation.success) {
      return fileValidation.response;
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Store and process document
    const documentResult = await processDocument(supabaseClient, adminClient, user.id, file);
    
    // Return immediate success response
    return new Response(
      JSON.stringify(documentResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
