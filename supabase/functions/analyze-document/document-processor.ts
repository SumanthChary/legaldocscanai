
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
    console.log(`Starting analysis for document ${documentId}, file size: ${file.size} bytes, type: ${file.type}`);
    
    // Extract text from file with enhanced handling for different formats
    let fileText;
    
    try {
      // Different strategies based on file type
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      // Read the file content with timeout handling
      const textPromise = file.text();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("File reading timed out")), 25000) // Increased timeout for larger files
      );
      
      fileText = await Promise.race([textPromise, timeoutPromise]);
      
      // Post-processing based on file type
      if (fileName.endsWith('.pdf') || fileType.includes('pdf')) {
        console.log("Processing PDF file");
        // Clean up common PDF extraction artifacts
        fileText = fileText
          .replace(/\f/g, '\n') // Form feed to newline
          .replace(/(\r\n|\r|\n){2,}/g, '\n\n') // Normalize multiple line breaks
          .replace(/[^\x20-\x7E\n\t]/g, ' '); // Remove non-printable characters
      } 
      else if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileType.includes('word')) {
        console.log("Processing Word document");
        // Clean up Word specific artifacts
        fileText = fileText
          .replace(/\[IMAGE\]/gi, '') 
          .replace(/\[TABLE\]/gi, '')
          .replace(/\[CHART\]/gi, '')
          .replace(/\s{2,}/g, ' '); // Collapse multiple spaces
      }
      
      // Basic content checks
      if (!fileText) {
        throw new Error('Could not extract text from file');
      }

      // Check if we have actual content, not just whitespace or formatting
      if (fileText.trim().length < 10) {
        throw new Error('The document contains insufficient text content');
      }

      console.log(`Successfully extracted ${fileText.length} characters of text`);
      
      // For binary files that might be incorrectly decoded as text
      if (fileText.includes('�') && fileText.indexOf('�') < 100) {
        throw new Error('This appears to be a binary or non-text document');
      }

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
      
      // More specific fallback summaries based on error types
      let fallbackSummary = null;
      
      // File type specific error handling
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (error.message?.includes("timed out")) {
        fallbackSummary = "This document was too large to process completely. Try uploading a smaller section or a plaintext version for better results.";
      } else if (error.message?.includes("binary")) {
        if (fileExt === 'pdf') {
          fallbackSummary = "This PDF appears to be image-based or encrypted. For best results, try converting it to text first using an OCR tool.";
        } else if (['doc', 'docx'].includes(fileExt || '')) {
          fallbackSummary = "This Word document contains elements we couldn't process. Try saving it as a plain text (.txt) file first.";
        } else {
          fallbackSummary = "This appears to be a binary or non-text document format that we couldn't process. Please try converting it to a text format first.";
        }
      } else if (error.message?.includes("insufficient text")) {
        fallbackSummary = "This document doesn't contain enough text content to generate a meaningful summary. Please check that it contains actual text content.";
      } else if (fileText && fileText.length > 0) {
        // If we have text but the API failed, try to provide some direct content
        const previewText = fileText.substring(0, 300).replace(/\s+/g, ' ').trim();
        fallbackSummary = `We encountered difficulties analyzing this document with our AI, but here's a preview of the content:\n\n${previewText}...\n\n(This is a direct excerpt as AI processing was unsuccessful.)`;
      } else {
        // File type specific generic fallbacks
        if (fileExt === 'pdf') {
          fallbackSummary = "We couldn't extract text from this PDF. It might be scanned, image-based, or encrypted. Try using an OCR tool first or upload a text version.";
        } else if (['doc', 'docx'].includes(fileExt || '')) {
          fallbackSummary = "We had trouble processing this Word document. For best results, save it as a plain text (.txt) file before uploading.";
        } else {
          fallbackSummary = "We were unable to generate a summary for this document. It may be in an unsupported format or contain content that's difficult to analyze.";
        }
      }
      
      // Update the document with the fallback summary
      await adminClient
        .from('document_analyses')
        .update({
          analysis_status: 'completed',  // Still mark as completed since we're providing some content
          summary: fallbackSummary
        })
        .eq('id', documentId);
      
      console.log("Used fallback summary for document:", documentId);
    }
  } catch (backgroundError) {
    console.error("Background task error:", backgroundError);
    
    // Final failsafe - ensure document doesn't remain in pending state indefinitely
    try {
      await adminClient
        .from('document_analyses')
        .update({
          analysis_status: 'failed',
          summary: 'Analysis failed due to an internal error. Please try again with a different document format.'
        })
        .eq('id', documentId);
    } catch (e) {
      console.error("Failed to update document status after error:", e);
    }
  }
}
