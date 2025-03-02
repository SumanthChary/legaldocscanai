
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the Gemini API key from environment variables
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verify the JWT and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: authError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Sanitize the filename
    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = sanitizedFileName.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create a pre-signed URL to access the uploaded file
    const { data: urlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60) // URL valid for 60 seconds

    if (!urlData?.signedUrl) {
      return new Response(
        JSON.stringify({ error: 'Failed to create signed URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
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
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save document metadata', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Process the document in the background
    EdgeRuntime.waitUntil(processDocumentWithAI(supabase, urlData.signedUrl, filePath, analysisRecord.id, geminiApiKey));

    return new Response(
      JSON.stringify({ message: 'Document uploaded and analysis started', filePath }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function processDocumentWithAI(supabase, fileUrl, filePath, analysisId, apiKey) {
  try {
    console.log(`Starting AI processing for document: ${filePath}`)
    
    // Fetch the file content
    const fileResponse = await fetch(fileUrl)
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`)
    }
    
    // For text files, we can process directly
    // For other formats, in a real implementation, you'd use a document parser
    let textContent = ""
    const contentType = fileResponse.headers.get('content-type')
    
    if (contentType?.includes('text/')) {
      textContent = await fileResponse.text()
    } else if (contentType?.includes('application/pdf')) {
      // Simplified for demo purposes - in reality, you'd use a PDF parser
      textContent = "This is a placeholder for PDF content that would be extracted"
    } else {
      textContent = "This is a placeholder for document content that would be extracted"
    }
    
    // Limit content size for the API request
    const truncatedContent = textContent.substring(0, 10000)
    
    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Please provide a concise summary of the following document content in about 3-5 sentences. Focus on the key points and main arguments. Here's the content:\n\n${truncatedContent}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
          }
        })
      }
    )
    
    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }
    
    const geminiData = await geminiResponse.json()
    let summary = "Could not generate summary."
    
    if (geminiData.candidates && geminiData.candidates.length > 0 && 
        geminiData.candidates[0].content && geminiData.candidates[0].content.parts) {
      summary = geminiData.candidates[0].content.parts[0].text
    }
    
    console.log(`Generated summary: ${summary.substring(0, 100)}...`)
    
    // Update the database with the summary
    const { error: updateError } = await supabase
      .from('document_analyses')
      .update({ 
        summary: summary,
        analysis_status: 'completed'
      })
      .eq('id', analysisId)
    
    if (updateError) {
      throw new Error(`Failed to update database: ${updateError.message}`)
    }
    
    console.log(`Successfully processed document: ${filePath}`)
  } catch (error) {
    console.error(`Error processing document with AI: ${error.message}`)
    
    // Update the database to mark the analysis as failed
    await supabase
      .from('document_analyses')
      .update({ 
        summary: `Error during analysis: ${error.message}`,
        analysis_status: 'failed'
      })
      .eq('id', analysisId)
  }
}
