
import { corsHeaders } from "./cors.ts";
import { analyzeWithGemini } from "./gemini-api.ts";
import { 
  enhancedPdfTextCleaning, 
  enhancedWordTextCleaning, 
  standardTextCleaning,
  containsBinaryIndicators 
} from "./text-processing.ts";
import { generateFallbackSummary } from "./fallback-summaries.ts";

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
        fileText = enhancedPdfTextCleaning(fileText);
      } 
      else if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileType.includes('word') || fileType.includes('document')) {
        console.log("Processing Word document");
        fileText = enhancedWordTextCleaning(fileText);
      }
      else if (fileName.endsWith('.txt') || fileType.includes('text')) {
        console.log("Processing plain text file");
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
      
      // Generate an appropriate fallback summary based on the error
      const fallbackSummary = generateFallbackSummary(error, fileName, fileText);
      
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
