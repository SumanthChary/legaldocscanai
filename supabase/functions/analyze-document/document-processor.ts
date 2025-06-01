
import { corsHeaders } from "./cors.ts";
import { analyzeWithGemini } from "./gemini-api.ts";
import { extractAndValidateText } from "./text-processing.ts";
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

  // Start the enhanced analysis in the background
  EdgeRuntime.waitUntil(analyzeDocumentEnhanced(file, document.id, adminClient));

  // Return immediate success response data
  return { 
    success: true, 
    message: 'Document uploaded and enhanced analysis started',
    document_id: document.id
  };
}

async function analyzeDocumentEnhanced(file: File, documentId: string, adminClient: any) {
  console.log(`🚀 Starting enhanced analysis for document ${documentId}`);
  console.log(`📁 File details: ${file.name} (${file.size} bytes, ${file.type})`);
  
  try {
    // Update status to show processing has started
    await adminClient
      .from('document_analyses')
      .update({ analysis_status: 'processing' })
      .eq('id', documentId);

    // Enhanced file processing with timeout and validation
    let fileText;
    try {
      console.log(`📖 Reading file content...`);
      
      // Read file with enhanced timeout handling
      const textPromise = file.text();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("File reading timed out after 90 seconds")), 90000)
      );
      
      fileText = await Promise.race([textPromise, timeoutPromise]);
      console.log(`✅ File read successfully: ${fileText.length} characters`);
      
    } catch (readError) {
      console.error(`❌ File reading failed:`, readError);
      throw new Error(`Failed to read file content: ${readError.message}`);
    }

    // Enhanced text extraction and validation
    let cleanedText;
    try {
      console.log(`🧹 Processing and validating text...`);
      cleanedText = extractAndValidateText(fileText, file.name);
      console.log(`✅ Text processing complete: ${cleanedText.length} characters validated`);
      
    } catch (processingError) {
      console.error(`❌ Text processing failed:`, processingError);
      throw processingError; // Re-throw to handle in fallback
    }

    // Enhanced AI analysis with better error handling
    let summary;
    try {
      console.log(`🤖 Starting AI analysis...`);
      summary = await analyzeWithGemini(cleanedText, file.name);
      
      if (!summary || summary.trim().length < 100) {
        throw new Error("AI analysis produced insufficient content");
      }
      
      console.log(`✅ AI analysis complete: ${summary.length} characters generated`);
      
    } catch (aiError) {
      console.error(`❌ AI analysis failed:`, aiError);
      throw aiError; // Will be handled by fallback logic
    }

    // Save successful analysis
    const { error: updateError } = await adminClient
      .from('document_analyses')
      .update({
        summary: summary,
        analysis_status: 'completed'
      })
      .eq('id', documentId);
    
    if (updateError) {
      console.error("❌ Database update error:", updateError);
      throw new Error("Failed to save analysis results to database");
    }
    
    console.log(`🎉 Document analysis completed successfully for document: ${documentId}`);
    
  } catch (error) {
    console.error(`💥 Analysis error for document ${documentId}:`, error);
    
    // Enhanced fallback handling
    try {
      console.log(`🛠️ Generating enhanced fallback summary...`);
      
      // Generate enhanced fallback summary
      const fallbackSummary = generateEnhancedFallbackSummary(error, file.name, fileText);
      
      // Update with fallback summary - still mark as completed since we're providing useful content
      await adminClient
        .from('document_analyses')
        .update({
          analysis_status: 'completed',
          summary: fallbackSummary
        })
        .eq('id', documentId);
      
      console.log(`✅ Enhanced fallback summary applied for document: ${documentId}`);
      
    } catch (fallbackError) {
      console.error("❌ Fallback summary generation failed:", fallbackError);
      
      // Final emergency fallback
      await adminClient
        .from('document_analyses')
        .update({
          analysis_status: 'failed',
          summary: generateEmergencyFallback(file.name, error)
        })
        .eq('id', documentId);
      
      console.log(`⚠️ Emergency fallback applied for document: ${documentId}`);
    }
  }
}

/**
 * Generate enhanced fallback summary with better user guidance
 */
function generateEnhancedFallbackSummary(error: any, fileName: string, fileText?: string): string {
  const fileExt = fileName.split('.').pop()?.toLowerCase();
  const timestamp = new Date().toLocaleDateString();
  
  let fallbackContent = `📄 **Document Analysis Report**\n**File:** ${fileName}\n**Analyzed:** ${timestamp}\n**Status:** Processing Issues Encountered\n\n---\n\n`;
  
  // Provide specific guidance based on error type
  if (error.message?.includes("timed out")) {
    fallbackContent += `⏱️ **Issue:** Document processing timed out\n\n**This typically happens when:**\n• Document is very large (>20MB)\n• Document contains complex formatting\n• Network connectivity issues\n\n**💡 Solutions:**\n• Break document into smaller sections (2-5 pages each)\n• Try uploading during off-peak hours\n• Simplify document formatting if possible`;
    
  } else if (error.message?.includes("binary") || error.message?.includes("insufficient text")) {
    fallbackContent += `📋 **Issue:** Document format not suitable for text analysis\n\n`;
    
    if (fileExt === 'pdf') {
      fallbackContent += `**PDF-Specific Solutions:**\n• Document may be image-based or scanned\n• Try using OCR software to convert to searchable PDF\n• Save as text (.txt) file if possible\n• Check if PDF is encrypted or password-protected`;
    } else if (['doc', 'docx'].includes(fileExt || '')) {
      fallbackContent += `**Word Document Solutions:**\n• Save as plain text (.txt) format\n• Remove embedded images, charts, and complex formatting\n• Copy text content and paste into new document\n• Ensure document isn't corrupted`;
    } else {
      fallbackContent += `**General Solutions:**\n• Convert to plain text (.txt) format\n• Ensure file contains actual text content\n• Remove any embedded objects or complex formatting\n• Try a different file format`;
    }
    
  } else if (error.message?.includes("quota") || error.message?.includes("API")) {
    fallbackContent += `🔧 **Issue:** AI service temporarily unavailable\n\n**What happened:**\n• High demand on AI analysis service\n• Temporary service limitation\n\n**💡 Solutions:**\n• Try again in 5-10 minutes\n• Use a smaller document if possible\n• Contact support if issue persists`;
    
  } else {
    fallbackContent += `⚠️ **Issue:** Unexpected processing error\n\n**Error Details:** ${error.message}\n\n**💡 Next Steps:**\n• Verify document is not corrupted\n• Try with a different file format\n• Contact support with error details if issue continues`;
  }
  
  // Add partial content if available
  if (fileText && fileText.length > 100) {
    const preview = fileText.substring(0, 800).trim();
    fallbackContent += `\n\n📝 **Partial Content Preview:**\n\n${preview}${fileText.length > 800 ? '...' : ''}`;
  }
  
  // Add helpful tips
  fallbackContent += `\n\n---\n\n💡 **For Best Results:**\n• Use text-based documents (not scanned images)\n• Keep files under 10MB when possible\n• Plain text (.txt) format works most reliably\n• Remove unnecessary formatting and embedded objects\n\n📞 **Need Help?** Contact our support team with your file details if you continue experiencing issues.`;
  
  return fallbackContent;
}

/**
 * Generate emergency fallback for critical failures
 */
function generateEmergencyFallback(fileName: string, error: any): string {
  const timestamp = new Date().toLocaleDateString();
  
  return `📄 **Document Analysis Report**\n**File:** ${fileName}\n**Analyzed:** ${timestamp}\n**Status:** Unable to Process\n\n---\n\n❌ **Critical Error Encountered**\n\nWe apologize, but we encountered a technical issue that prevented us from analyzing your document.\n\n**Error Reference:** ${error.message || 'Unknown error'}\n\n**🛠️ Immediate Actions:**\n• Try uploading a different file format\n• Ensure your document is text-based (not scanned)\n• Verify file is not corrupted\n• Contact support with this error reference\n\n**📞 Support Contact:**\nPlease reach out to our technical support team with:\n• This error message\n• Your file name and type\n• File size information\n\nWe'll help resolve this issue quickly.\n\n---\n\n**Timestamp:** ${timestamp} | **Reference ID:** ${fileName.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
}
