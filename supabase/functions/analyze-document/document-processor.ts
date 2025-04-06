
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
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    
    try {
      console.log(`Processing file: ${fileName}, type: ${fileType}`);
      
      // Read the file content with timeout handling
      const textPromise = file.text();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("File reading timed out")), 60000) // 60 second timeout for larger files
      );
      
      fileText = await Promise.race([textPromise, timeoutPromise]);
      
      // Enhanced format-specific processing
      if (fileName.endsWith('.pdf') || fileType.includes('pdf')) {
        console.log("Processing PDF file");
        // Advanced PDF text cleanup
        fileText = enhancedPdfTextCleaning(fileText);
      } 
      else if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileType.includes('word') || fileType.includes('document')) {
        console.log("Processing Word document");
        // Advanced Word document text cleanup
        fileText = enhancedWordTextCleaning(fileText);
      }
      else if (fileName.endsWith('.txt') || fileType.includes('text')) {
        console.log("Processing plain text file");
        // Basic text cleanup
        fileText = standardTextCleaning(fileText);
      }
      
      // More robust content validation
      if (!fileText || fileText.trim().length === 0) {
        throw new Error('Could not extract text from file');
      }

      // Check for actual content beyond formatting characters
      if (fileText.trim().length < 10) {
        throw new Error('The document contains insufficient text content');
      }

      console.log(`Successfully extracted ${fileText.length} characters of text`);
      
      // For binary files that might be incorrectly decoded as text
      if (containsBinaryIndicators(fileText)) {
        throw new Error(`This appears to be a binary or non-text document format: ${fileType}`);
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
      
      // More specific and helpful fallback summaries based on error types and file formats
      let fallbackSummary = null;
      const fileExt = fileName.split('.').pop()?.toLowerCase();
      
      if (error.message?.includes("timed out")) {
        fallbackSummary = "This document was too large to process completely. Try uploading a smaller section or dividing it into multiple parts for better results.";
      } else if (error.message?.includes("binary")) {
        if (fileExt === 'pdf') {
          fallbackSummary = "This PDF appears to be image-based, encrypted, or contains complex formatting that our system couldn't process. For best results, try converting it to text first using an OCR tool.";
        } else if (['doc', 'docx'].includes(fileExt || '')) {
          fallbackSummary = "This Word document contains elements we couldn't process. Try saving it as a plain text (.txt) file first or copy/paste the content directly into a new text document.";
        } else {
          fallbackSummary = "This appears to be a binary or non-text document format that we couldn't process. Please try converting it to a text format first.";
        }
      } else if (error.message?.includes("insufficient text")) {
        fallbackSummary = "This document doesn't contain enough text content to generate a meaningful summary. Please check that it contains actual text content and not just images or formatting.";
      } else if (fileText && fileText.length > 0) {
        // If we have text but the API failed, try to provide some direct content
        const previewText = fileText.substring(0, 500).replace(/\s+/g, ' ').trim();
        fallbackSummary = `We encountered difficulties analyzing this document with our AI, but here's a preview of the content:\n\n${previewText}...\n\n(This is a direct excerpt as AI processing was unsuccessful. Please try again with a different file format or divide the document into smaller parts.)`;
      } else {
        // File type specific generic fallbacks
        if (fileExt === 'pdf') {
          fallbackSummary = "We couldn't extract text from this PDF. It might be scanned, image-based, or encrypted. Try using an OCR tool first or upload a text version of the document.";
        } else if (['doc', 'docx'].includes(fileExt || '')) {
          fallbackSummary = "We had trouble processing this Word document. For best results, save it as a plain text (.txt) file before uploading or try copying the text directly into a new document.";
        } else {
          fallbackSummary = "We were unable to generate a summary for this document. It may be in an unsupported format or contain content that's difficult to analyze. Try converting it to a plain text format first.";
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
          summary: 'Analysis failed due to an internal error. Please try again with a different document format or contact support if the problem persists.'
        })
        .eq('id', documentId);
    } catch (e) {
      console.error("Failed to update document status after error:", e);
    }
  }
}

// Enhanced text processing functions
function enhancedPdfTextCleaning(text: string): string {
  return text
    .replace(/\f/g, '\n\n') // Form feed to paragraph break
    .replace(/(\r\n|\r|\n){2,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/[^\x20-\x7E\n\t]/g, ' ') // Remove non-printable characters
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/•\s*/g, '• ') // Fix bullet points
    .replace(/([.!?])\s*\n/g, '$1\n\n') // Make sure sentences end with proper spacing
    .replace(/(\d+)\.\s*([A-Z])/g, '$1. $2') // Fix numbered lists
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .replace(/([^.!?:])\s*\n\s*([a-z])/g, '$1 $2') // Fix line breaks in middle of sentences
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '') // Remove page numbers
    .replace(/^\s*(Page|\d+)\s*$\n/gm, '') // Remove isolated page markers
    .replace(/([^\w])(\d{1,2})[\-\–](\d{1,2})[\-\–](\d{2,4})([^\w])/g, '$1$2-$3-$4$5') // Fix date formats
    .trim();
}

function enhancedWordTextCleaning(text: string): string {
  return text
    .replace(/\[IMAGE\]/gi, '') 
    .replace(/\[TABLE.*?\]/gi, '')
    .replace(/\[CHART.*?\]/gi, '')
    .replace(/\[FIGURE\d*.*?\]/gi, '')
    .replace(/\[PAGE\d*\]/gi, '')
    .replace(/(\r\n|\r|\n){2,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/•\s*/g, '• ') // Fix bullet points
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .replace(/([^.!?:])\s*\n\s*([a-z])/g, '$1 $2') // Fix line breaks in middle of sentences
    .replace(/Header\s*:.*?\n/gi, '') // Remove headers
    .replace(/Footer\s*:.*?\n/gi, '') // Remove footers
    .replace(/Footnote\s*:.*?\n/gi, '') // Remove footnote markers
    .replace(/^\s*\d+\s*$\n/gm, '') // Remove isolated page numbers
    .replace(/([^\w])(\d{1,2})[\-\–](\d{1,2})[\-\–](\d{2,4})([^\w])/g, '$1$2-$3-$4$5') // Fix date formats
    .trim();
}

function standardTextCleaning(text: string): string {
  return text
    .replace(/(\r\n|\r|\n){2,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .trim();
}

function containsBinaryIndicators(text: string): boolean {
  // Check for high concentration of unprintable characters
  const unprintableCount = (text.substring(0, 1000).match(/[^\x20-\x7E\n\t]/g) || []).length;
  const unprintableRatio = unprintableCount / Math.min(1000, text.length);
  
  return (
    // High ratio of unprintable characters at start of file
    unprintableRatio > 0.3 ||
    // Specific binary file signatures near the start
    text.substring(0, 50).includes('�PNG') ||
    text.substring(0, 50).includes('JFIF') ||
    text.substring(0, 50).includes('%PDF-') && text.indexOf('�') < 100
  );
}
