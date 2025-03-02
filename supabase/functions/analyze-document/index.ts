
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the Gemini API key from environment variables
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Verify the JWT and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) {
      console.error('Invalid token:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: authError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create storage bucket if it doesn't exist
    const { error: createBucketError } = await supabase.storage.createBucket('documents', {
      public: false,
      allowedMimeTypes: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      fileSizeLimit: 10485760, // 10MB
    });

    if (createBucketError && !createBucketError.message.includes('already exists')) {
      console.error('Error creating bucket:', createBucketError);
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('No file uploaded');
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Sanitize the filename
    const originalFileName = file.name;
    const sanitizedFileName = originalFileName.replace(/[^\x00-\x7F]/g, '');
    const fileExt = sanitizedFileName.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    console.log(`Processing file: ${originalFileName} (${file.type}), size: ${file.size} bytes`);

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create a pre-signed URL to access the uploaded file
    const { data: urlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 300); // URL valid for 5 minutes

    if (!urlData?.signedUrl) {
      console.error('Failed to create signed URL');
      return new Response(
        JSON.stringify({ error: 'Failed to create signed URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Insert document analysis record with user_id
    const { data: analysisRecord, error: dbError } = await supabase
      .from('document_analyses')
      .insert({
        document_path: filePath,
        original_name: sanitizedFileName,
        analysis_status: 'pending',
        user_id: user.id
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save document metadata', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Document uploaded successfully. Path: ${filePath}, Analysis ID: ${analysisRecord.id}`);

    // Process the document in the background
    EdgeRuntime.waitUntil(processDocumentWithAI(supabase, urlData.signedUrl, filePath, analysisRecord.id, geminiApiKey));

    return new Response(
      JSON.stringify({ 
        message: 'Document uploaded and analysis started', 
        id: analysisRecord.id,
        filePath
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function processDocumentWithAI(supabase, fileUrl, filePath, analysisId, apiKey) {
  try {
    console.log(`Starting AI processing for document: ${filePath}`);
    
    // Fetch the file content
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }
    
    // Get the content based on file type
    let textContent = "";
    const contentType = fileResponse.headers.get('content-type');
    
    if (contentType?.includes('text/')) {
      textContent = await fileResponse.text();
    } else if (contentType?.includes('application/pdf') || contentType?.includes('application/msword') || contentType?.includes('application/vnd.openxmlformats-officedocument')) {
      // For demonstration, we'll just read what we can as text
      // In a production environment, you'd use specialized parsers based on file type
      try {
        textContent = await fileResponse.text();
      } catch (e) {
        textContent = `This is a ${contentType} document that requires specialized parsing.`;
      }
    } else {
      textContent = `This document has content type ${contentType} which requires specialized parsing.`;
    }
    
    // Limit content size for the API request
    const truncatedContent = textContent.substring(0, 30000);
    
    console.log(`Extracted ${truncatedContent.length} characters from document`);
    
    // Using a placeholder summary while Gemini API integration is fixed
    // This ensures the flow works end-to-end
    let summary = "";
    
    try {
      // Call Gemini API
      console.log(`Calling Gemini API with key: ${apiKey ? apiKey.substring(0, 5) + '...' : 'not available'}`);
      
      // Use the correct Gemini API endpoint
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const geminiResponse = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze and summarize this document content in 3-5 short paragraphs. Focus on the main points, key arguments, and any important conclusions. Keep your summary concise but comprehensive.
                  
                  Document content:
                  ${truncatedContent}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
          }
        })
      });
      
      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error(`Gemini API error (${geminiResponse.status}): ${errorText}`);
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      }
      
      const geminiData = await geminiResponse.json();
      console.log('Gemini API response:', JSON.stringify(geminiData).substring(0, 200) + '...');
      
      if (geminiData.candidates && geminiData.candidates.length > 0 && 
          geminiData.candidates[0].content && geminiData.candidates[0].content.parts) {
        summary = geminiData.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unable to extract summary from Gemini API response");
      }
    } catch (apiError) {
      console.error(`AI API error: ${apiError.message}`);
      
      // If Gemini API fails, use a fallback summary approach
      summary = "Document contains approximately " + truncatedContent.length + 
               " characters. The document appears to be a " + contentType + 
               " file. A detailed AI analysis could not be generated at this time.";
    }
    
    console.log(`Generated summary: ${summary.substring(0, 100)}...`);
    
    // Update the database with the summary
    const { error: updateError } = await supabase
      .from('document_analyses')
      .update({ 
        summary: summary,
        analysis_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', analysisId);
    
    if (updateError) {
      console.error(`Failed to update database: ${updateError.message}`);
      throw new Error(`Failed to update database: ${updateError.message}`);
    }
    
    console.log(`Successfully processed document: ${filePath}`);
  } catch (error) {
    console.error(`Error processing document with AI: ${error.message}`);
    
    // Update the database to mark the analysis as failed
    await supabase
      .from('document_analyses')
      .update({ 
        summary: `Error during analysis: ${error.message}`,
        analysis_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', analysisId);
  }
}
