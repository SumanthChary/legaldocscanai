
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
    console.log(`Starting analysis for document ${documentId}, file size: ${file.size} bytes`);
    
    // Extract text from file - optimized version
    let fileText;
    
    try {
      // Read the file content with timeout handling
      const textPromise = file.text();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("File reading timed out")), 15000)
      );
      
      fileText = await Promise.race([textPromise, timeoutPromise]);
      
      // Basic validation
      if (!fileText || fileText.length === 0) {
        throw new Error('Could not extract text from file');
      }

      console.log(`Successfully extracted ${fileText.length} characters of text`);
      
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
      
      console.log("Document analysis completed successfully for document:", documentId);
    } catch (error) {
      console.error(`Analysis error for document ${documentId}:`, error);
      
      // Generate a fallback summary for common errors
      let fallbackSummary = null;
      if (error.message?.includes("timed out") || 
          error.message?.includes("Could not extract text")) {
        fallbackSummary = "We were unable to fully process this document due to its format or size. " +
                         "Please try uploading a smaller or plaintext version for better results.";
      }
      
      // Update the document status based on whether we have a fallback
      if (fallbackSummary) {
        await adminClient
          .from('document_analyses')
          .update({
            analysis_status: 'completed', // Mark as completed even with fallback
            summary: fallbackSummary
          })
          .eq('id', documentId);
        
        console.log("Used fallback summary for document:", documentId);
      } else {
        // Only mark as failed if we don't have a fallback
        await adminClient
          .from('document_analyses')
          .update({
            analysis_status: 'failed',
            summary: `Analysis failed: ${error.message}`
          })
          .eq('id', documentId);
      }
    }
  } catch (backgroundError) {
    console.error("Background task error:", backgroundError);
    
    // Final failsafe - ensure document doesn't remain in pending state indefinitely
    try {
      await adminClient
        .from('document_analyses')
        .update({
          analysis_status: 'failed',
          summary: 'Analysis failed due to an internal error. Please try again.'
        })
        .eq('id', documentId);
    } catch (e) {
      console.error("Failed to update document status after error:", e);
    }
  }
}
