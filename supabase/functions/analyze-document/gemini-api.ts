
import { smartChunking } from "./text-chunking.ts";
import { getDetailedPrompt, getLegalPrompt, getBusinessPrompt } from "./prompt-templates.ts";
import { callGeminiAPI, getDocumentContext } from "./gemini-client.ts";

// Enhanced Gemini analysis function with improved prompting and context awareness
export async function analyzeWithGemini(text: string, fileName: string = 'document'): Promise<string> {
  console.log(`Starting enhanced analysis with Gemini... Text length: ${text.length}, File: ${fileName}`);
  
  // Check if the text is empty or contains only whitespace
  if (!text || text.trim().length === 0) {
    return "📄 **Document Analysis Result**\n\n❌ **Issue Identified:** The document appears to be empty or contains only formatting characters.\n\n🔧 **Recommended Actions:**\n• Verify the document contains actual text content\n• Check if the file is corrupted or improperly formatted\n• Try uploading a different version of the document\n• For PDF files, ensure they are text-based and not scanned images";
  }
  
  // Clean the text to remove problematic characters while preserving structure
  const cleanedText = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n'); // Clean up excessive line breaks
  
  // Analyze document context for better prompting
  const documentContext = getDocumentContext(cleanedText, fileName);
  console.log(`Document detected as: ${documentContext.type} with approach: ${documentContext.approach}`);
  
  // Smart chunking for very large documents
  const chunks = smartChunking(cleanedText);
  console.log(`Document processed into ${chunks.length} chunks`);
  
  try {
    if (chunks.length === 1) {
      // For documents that fit in a single chunk - use context-aware prompting
      console.log("Performing complete document analysis with enhanced context-aware prompting");
      
      let prompt = getDetailedPrompt("complete");
      
      // Use specialized prompts for specific document types
      if (documentContext.type === 'legal') {
        prompt = getLegalPrompt();
      } else if (documentContext.type === 'business') {
        prompt = getBusinessPrompt();
      }
      
      const summary = await callGeminiAPI(chunks[0], prompt, 0.2);
      
      // Validate and enhance the summary
      return enhanceSummaryQuality(summary, documentContext.type, fileName);
      
    } else {
      // For documents that needed to be chunked
      console.log(`Document requires chunking - processing ${chunks.length} sections with enhanced coordination`);
      
      const chunkSummaries = [];
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chunk ${i+1}/${chunks.length} with context: ${documentContext.type}`);
        
        const chunkSummary = await callGeminiAPI(
          chunks[i],
          getDetailedPrompt("chunk", i+1, chunks.length),
          0.2
        );
        chunkSummaries.push(`**Section ${i+1}/${chunks.length}:**\n${chunkSummary}`);
      }
      
      // Combine chunk summaries with enhanced coordination
      const combinedText = chunkSummaries.join("\n\n--- SECTION BREAK ---\n\n");
      console.log("Creating final coordinated summary from all sections");
      
      const finalSummary = await callGeminiAPI(
        combinedText,
        getDetailedPrompt("combine"),
        0.1 // Lower temperature for more consistent combination
      );
      
      return enhanceSummaryQuality(finalSummary, documentContext.type, fileName);
    }
  } catch (error) {
    console.error("Enhanced analysis approach failed:", error);
    
    // Improved fallback with better error handling
    try {
      console.log("Attempting simplified high-quality fallback approach");
      const shorterText = chunks[0].substring(0, 10000); // Increased from 8000
      
      const fallbackSummary = await callGeminiAPI(
        shorterText,
        `You are a document analysis expert. Provide a comprehensive, well-structured summary of this document.

**Required Format:**
📋 **DOCUMENT OVERVIEW**
- Brief description of document type and purpose

🎯 **KEY POINTS**
- Most important information (in bullet points)

📊 **MAIN CONTENT**
- Detailed breakdown of content

⚡ **IMPORTANT DETAILS**
- Critical information readers need to know

Document content:`, 
        0.2
      );
      
      return `📄 **Document Analysis** (Simplified Analysis)\n\n${fallbackSummary}\n\n---\n\n⚠️ **Note:** This is a simplified analysis due to processing constraints. For complete analysis, try with a shorter document or contact support.`;
      
    } catch (secondError) {
      console.error("Fallback approach also failed:", secondError);
      
      // Final emergency fallback with structured content extraction
      try {
        const minimalText = chunks[0].substring(0, 5000);
        console.log("Final attempt with minimal structured extraction");
        
        const emergencySummary = await callGeminiAPI(
          minimalText,
          "Extract and organize the key information from this document in a clear, structured format:", 
          0.1
        );
        
        return `📄 **Document Analysis** (Emergency Processing)\n\n${emergencySummary}\n\n---\n\n⚠️ **Processing Note:** Full analysis was not possible due to technical constraints. This summary covers the main content found. Please try again or contact support for assistance.`;
        
      } catch (finalError) {
        console.error("All enhanced analysis attempts failed:", finalError);
        
        // Structured error response with actionable guidance
        const partialContent = chunks[0].substring(0, 1000);
        
        return `📄 **Document Analysis Report**\n\n❌ **Processing Status:** Unable to complete AI analysis\n\n📝 **Partial Content Preview:**\n${partialContent}...\n\n🔧 **Troubleshooting Steps:**\n• **File Format:** Ensure document is in supported format (PDF, Word, TXT)\n• **File Size:** Try with smaller documents (under 10MB)\n• **Content Type:** Verify document contains readable text (not just images)\n• **Quality:** Check if PDF is text-based, not scanned images\n\n💡 **Alternative Solutions:**\n• Break large documents into smaller sections\n• Convert scanned PDFs using OCR tools\n• Save Word documents as plain text (.txt) files\n• Contact support if issues persist\n\n📞 **Support:** If you continue experiencing issues, please contact our support team with details about your document type and size.`;
      }
    }
  }
}

/**
 * Enhance summary quality with additional formatting and validation
 */
function enhanceSummaryQuality(summary: string, documentType: string, fileName: string): string {
  if (!summary || summary.trim().length < 50) {
    return `📄 **Document Analysis Report**\n\n❌ **Analysis Issue:** Generated summary was insufficient.\n\n🔧 **Please Try:**\n• Uploading a different file format\n• Ensuring document contains readable text\n• Breaking large documents into smaller sections\n• Contact support if the issue persists`;
  }
  
  // Add document header with metadata
  const timestamp = new Date().toLocaleDateString();
  const header = `📄 **Document Analysis Report**\n**File:** ${fileName}\n**Analyzed:** ${timestamp}\n**Type:** ${documentType.charAt(0).toUpperCase() + documentType.slice(1)} Document\n\n---\n\n`;
  
  // Ensure proper formatting
  let enhancedSummary = summary;
  
  // Add structure if missing
  if (!summary.includes('**') && !summary.includes('#')) {
    enhancedSummary = `**Document Summary:**\n\n${summary}`;
  }
  
  // Add footer with analysis note
  const footer = `\n\n---\n\n✅ **Analysis Complete** | Generated by LegalDeep AI | ${timestamp}`;
  
  return header + enhancedSummary + footer;
}
