
import { corsHeaders } from "./cors.ts";
import { analyzeWithGemini } from "./gemini-api.ts";

export async function processDocument(supabaseClient: any, adminClient: any, userId: string, file: File) {
  // Store the document in the database first
  const { data: document, error: documentError } = await supabaseClient
    .from('document_analyses')
    .insert({
      user_id: userId,
      document_path: file.name, 
      original_name: file.name,
      analysis_status: 'pending'
    })
    .select()
    .single();
  
  if (documentError) {
    console.error("Document insert error:", documentError);
    return {
      error: 'Failed to create document record',
      status: 500
    };
  }
  
  console.log("Document record created:", document.id);

  // Start the analysis in the background
  EdgeRuntime.waitUntil(analyzeDocument(file, document.id, adminClient));

  // Return immediate success response data
  return { 
    success: true, 
    message: 'Document uploaded and analysis started',
    document_id: document.id
  };
}

async function analyzeDocument(file: File, documentId: string, adminClient: any) {
  try {
    // Extract text from file - optimized version
    let fileText;
    
    try {
      // Read the file content
      fileText = await file.text();
      
      // Simplified text processing - faster
      if (!fileText || fileText.length === 0) {
        throw new Error('Could not extract text from file');
      }

      // Limit text length to prevent API issues and be more efficient
      const maxLength = 8000; // Reduced for faster processing
      if (fileText.length > maxLength) {
        console.log(`Truncating text from ${fileText.length} to ${maxLength} characters`);
        fileText = fileText.substring(0, maxLength) + "...";
      }
      
      console.log(`Extracted ${fileText.length} characters of text`);
      
      // Get the summary from Gemini API
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
        .eq('id', documentId);
      
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
        .eq('id', documentId);
    }
  } catch (backgroundError) {
    console.error("Background task error:", backgroundError);
  }
}
