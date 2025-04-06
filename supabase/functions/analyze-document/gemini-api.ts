
import { smartChunking } from "./text-chunking.ts";
import { getDetailedPrompt } from "./prompt-templates.ts";
import { callGeminiAPI } from "./gemini-client.ts";

// Improved Gemini analysis function with better error handling and fallback strategies
export async function analyzeWithGemini(text: string): Promise<string> {
  console.log("Analyzing with Gemini... Text length:", text.length);
  
  // Check if the text is empty or contains only whitespace
  if (!text || text.trim().length === 0) {
    return "The document appears to be empty or contains only formatting. Please check the document and try again.";
  }
  
  // Clean the text to remove problematic characters
  const cleanedText = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  // Smart chunking for very large documents
  const chunks = smartChunking(cleanedText);
  
  try {
    if (chunks.length === 1) {
      // For documents that fit in a single chunk
      console.log("Attempting complete document analysis with enhanced prompting");
      const summary = await callGeminiAPI(
        chunks[0],
        getDetailedPrompt("complete"),
        0.3
      );
      return summary;
    } else {
      // For documents that needed to be chunked
      console.log(`Document required chunking into ${chunks.length} parts`);
      
      // Process each chunk and then combine the results
      const chunkSummaries = [];
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chunk ${i+1}/${chunks.length}`);
        const chunkSummary = await callGeminiAPI(
          chunks[i],
          getDetailedPrompt("chunk", i+1, chunks.length),
          0.3
        );
        chunkSummaries.push(chunkSummary);
      }
      
      // Combine chunk summaries into a coherent whole
      const combinedText = chunkSummaries.join("\n\n--- Next Section ---\n\n");
      console.log("Creating final combined summary");
      
      // Final pass to create a coherent summary from the chunks
      const finalSummary = await callGeminiAPI(
        combinedText,
        getDetailedPrompt("combine"),
        0.2
      );
      
      return finalSummary;
    }
  } catch (error) {
    console.error("Primary analysis approach failed:", error);
    
    // Enhanced fallback approach
    try {
      const shorterText = chunks[0].substring(0, 8000);
      console.log("Retrying with comprehensive fallback approach");
      
      const fallbackSummary = await callGeminiAPI(
        shorterText,
        "Provide a comprehensive and detailed summary of this document, covering all key points, findings, and information:", 
        0.2
      );
      return fallbackSummary;
    } catch (secondError) {
      console.error("Enhanced fallback approach failed:", secondError);
      
      // Final simplified fallback
      try {
        const minimalText = chunks[0].substring(0, 3000);
        console.log("Final attempt with minimal text");
        
        const minimalSummary = await callGeminiAPI(
          minimalText,
          "Summarize this document text as thoroughly as possible:", 
          0.1
        );
        return minimalSummary;
      } catch (finalError) {
        console.error("All Gemini API attempts failed:", finalError);
        
        // Last resort extraction
        const extractedContent = chunks[0].substring(0, 500);
        
        return `We encountered challenges processing this document fully, but here's what we found:\n\n${extractedContent}...\n\n(Note: This is a partial extraction as the AI processing encountered difficulties with the full document.)`;
      }
    }
  }
}
