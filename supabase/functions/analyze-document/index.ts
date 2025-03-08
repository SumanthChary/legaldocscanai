
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("User authenticated:", user.id);

    // Check document limits for user
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('document_count, document_limit')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (profile.document_count >= profile.document_limit) {
      return new Response(
        JSON.stringify({ error: 'Document limit reached. Please upgrade your plan for more documents.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process the formData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;
    
    console.log(`Processing file: ${fileName}, type: ${fileType}, size: ${fileSize} bytes`);

    if (fileSize > 50 * 1024 * 1024) { // 50MB limit
      return new Response(
        JSON.stringify({ error: 'File size exceeds the 50MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store the document in the database first
    const { data: document, error: documentError } = await supabaseClient
      .from('document_analyses')
      .insert({
        user_id: user.id,
        document_path: fileName, 
        original_name: fileName,
        analysis_status: 'pending'
      })
      .select()
      .single();
    
    if (documentError) {
      console.error("Document insert error:", documentError);
      return new Response(
        JSON.stringify({ error: 'Failed to create document record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Document record created:", document.id);

    // Start the analysis in the background
    const analyzeDocument = async () => {
      try {
        // Extract text from file - improved version
        let fileText;
        
        try {
          // Read the file content based on type
          if (fileType === 'application/pdf') {
            // For real implementation, we would use a PDF parser
            // For now, using a simplified approach
            fileText = await file.text();
            
            // Handle PDF format specifically - at least try to skip binary data
            if (fileText.includes('%PDF-')) {
              fileText = `This is a PDF document titled "${fileName}". For better results, please upload a text file.`;
            }
          } else if (fileType.includes('word')) {
            // For real implementation, we would use a docx parser
            fileText = `This is a Word document titled "${fileName}". For better results, please upload a text file.`;
          } else {
            // For text files, directly read the content
            fileText = await file.text();
          }

          if (!fileText || fileText.length === 0) {
            throw new Error('Could not extract text from file');
          }

          // Limit text length to prevent API issues and be more efficient
          const maxLength = 10000; // Reduced from 30000
          if (fileText.length > maxLength) {
            console.log(`Truncating text from ${fileText.length} to ${maxLength} characters`);
            fileText = fileText.substring(0, maxLength) + "...";
          }
          
          console.log(`Extracted ${fileText.length} characters of text`);
          
          // Use directly Gemini API for speed - no fallback logic to slow things down
          if (!GEMINI_API_KEY) {
            throw new Error("Gemini API key not configured");
          }
          
          // Optimize the prompt for faster, more concise responses
          const summary = await analyzeWithGemini(fileText);
          
          if (!summary) {
            throw new Error("Analysis did not produce a summary");
          }

          // Update the document with the summary
          const { error: updateError } = await adminClient
            .from('document_analyses')
            .update({
              summary: summary,
              analysis_status: 'completed'
            })
            .eq('id', document.id);
          
          if (updateError) {
            console.error("Update error:", updateError);
            throw new Error("Failed to save analysis results");
          }
          
          console.log("Document analysis completed successfully");
        } catch (error) {
          console.error("Analysis error:", error);
          
          // Update the document status to failed
          await adminClient
            .from('document_analyses')
            .update({
              analysis_status: 'failed',
              summary: `Analysis failed: ${error.message}`
            })
            .eq('id', document.id);
        }
      } catch (backgroundError) {
        console.error("Background task error:", backgroundError);
      }
    };

    // Start analysis in the background - this will not block the response
    EdgeRuntime.waitUntil(analyzeDocument());

    // Return immediate success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document uploaded and analysis started',
        document_id: document.id
      }),
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

// Optimized Gemini analysis function
async function analyzeWithGemini(text: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  console.log("Analyzing with Gemini...");
  
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Provide a brief summary of this document in 3-5 sentences:
          
          ${text}`
        }]
      }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more focused responses
        maxOutputTokens: 512, // Reduced token count for faster responses
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error response:", errorText);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  // Extract the content from Gemini response
  if (
    result.candidates && 
    result.candidates[0]?.content?.parts && 
    result.candidates[0].content.parts[0]?.text
  ) {
    return result.candidates[0].content.parts[0].text;
  } else {
    console.error("Unexpected Gemini response format:", JSON.stringify(result));
    throw new Error("Invalid response format from Gemini API");
  }
}
