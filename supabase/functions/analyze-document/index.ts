
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
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
        document_path: fileName, // Temporary path, would be updated with actual storage path
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
        let fileText;
        
        try {
          // Read the file content based on type
          if (fileType === 'application/pdf') {
            // For PDF, we would need a PDF parser
            // This is simplified - in a real implementation use a PDF parsing library
            fileText = `Extracted content from PDF: ${fileName}`;
          } else if (fileType.includes('word')) {
            // For Word documents, similar approach
            fileText = `Extracted content from Word document: ${fileName}`;
          } else {
            // For text files, directly read the content
            fileText = await file.text();
          }

          if (!fileText || fileText.length === 0) {
            throw new Error('Could not extract text from file');
          }

          // Limit text length to prevent API issues
          const maxLength = 30000;
          if (fileText.length > maxLength) {
            console.log(`Truncating text from ${fileText.length} to ${maxLength} characters`);
            fileText = fileText.substring(0, maxLength) + "...";
          }
          
          console.log(`Extracted ${fileText.length} characters of text`);
          
          // Try using Gemini API first
          let summary = null;
          try {
            summary = await analyzeWithGemini(fileText);
          } catch (geminiError) {
            console.error("Gemini API error:", geminiError);
            // Fall back to OpenAI
            if (OPENAI_API_KEY) {
              console.log("Falling back to OpenAI...");
              summary = await analyzeWithOpenAI(fileText);
            } else {
              throw new Error("All analysis methods failed");
            }
          }

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
              analysis_status: 'failed'
            })
            .eq('id', document.id);
        }
      } catch (backgroundError) {
        console.error("Background task error:", backgroundError);
      }
    };

    // Start analysis in the background
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
          text: `Please analyze this document and provide a comprehensive summary:
          
          ${text}
          
          Focus on key points, main arguments, and important details. Format your response in clear paragraphs.`
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error response:", errorText);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  // Correctly extract the content from Gemini response
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

async function analyzeWithOpenAI(text: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  console.log("Analyzing with OpenAI...");
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a document analysis assistant that provides comprehensive summaries of documents."
        },
        {
          role: "user",
          content: `Please analyze this document and provide a comprehensive summary:
          
          ${text}
          
          Focus on key points, main arguments, and important details. Format your response in clear paragraphs.`
        }
      ],
      temperature: 0.2,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API error response:", errorText);
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return result.choices[0].message.content;
}
