
import { callGroqCloudAPI } from "../groqcloud-client.ts";

export async function processWithGroqUltraFast(text: string, fileName: string, documentContext?: any): Promise<string> {
  console.log("⚡ GroqCloud MAXIMUM SPEED processing - API CALL STARTING");
  console.log(`🔑 GroqCloud API Key available: ${!!Deno.env.get('GROQCLOUD_API_KEY')}`);
  
  const maxChunkSize = 5000;
  
  // Create enhanced prompt based on document type
  const getPromptForContext = (isChunk = false, chunkInfo = "") => {
    if (documentContext?.type === 'legal') {
      return `PROFESSIONAL LEGAL ANALYSIS${isChunk ? ` ${chunkInfo}` : ''} - Provide comprehensive legal insights for document "${fileName}":

⚖️ ESSENTIAL LEGAL ANALYSIS:
- Identify document type, parties, and legal framework
- Extract key clauses, obligations, and rights
- Highlight critical legal provisions and implications
- Assess risks, liabilities, and compliance requirements
- Provide actionable legal recommendations
- Include clause-by-clause breakdown for important provisions

${isChunk ? 'Focus on this section while being aware it\'s part of a larger legal document.' : 'Provide complete professional legal analysis.'}`;
    } else if (documentContext?.type === 'business') {
      return `PROFESSIONAL BUSINESS ANALYSIS${isChunk ? ` ${chunkInfo}` : ''} - Provide comprehensive business insights for document "${fileName}":

📊 ESSENTIAL BUSINESS ANALYSIS:
- Identify business objectives and strategic elements
- Extract financial data and operational details
- Highlight performance metrics and success factors
- Assess business risks and opportunities
- Provide actionable business recommendations
- Include competitive and market analysis

${isChunk ? 'Focus on this section while being aware it\'s part of a larger business document.' : 'Provide complete professional business analysis.'}`;
    } else {
      return `PROFESSIONAL DOCUMENT ANALYSIS${isChunk ? ` ${chunkInfo}` : ''} - Provide comprehensive analysis for document "${fileName}":

🎯 ESSENTIAL ANALYSIS:
- Extract all key information and insights
- Provide detailed content breakdown
- Highlight critical points and implications
- Assess actionable recommendations
- Include professional-grade analysis that saves time
- Focus on value-adding insights

${isChunk ? 'Focus on this section while being aware it\'s part of a larger document.' : 'Provide complete comprehensive analysis.'}`;
    }
  };
  
  if (text.length <= maxChunkSize) {
    try {
      console.log("🚀 Processing single chunk with GroqCloud...");
      const result = await callGroqCloudAPI(
        text,
        getPromptForContext(),
        "llama-3.1-8b-instant"
      );
      console.log(`✅ GROQ API SUCCESS: Generated ${result.length} characters`);
      
      if (!result || result.trim().length === 0) {
        throw new Error("GroqCloud returned empty response");
      }
      
      return result;
    } catch (error) {
      console.error("❌ GROQ API FAILED:", error);
      console.error("❌ API Key exists:", !!Deno.env.get('GROQCLOUD_API_KEY'));
      throw new Error(`GroqCloud API failed: ${error.message}`);
    }
  }
  
  // Process large documents in chunks
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize));
  }
  
  console.log(`⚡ Processing ${chunks.length} chunks in ULTRA-FAST parallel mode`);
  
  const maxParallelChunks = Math.min(chunks.length, 3);
  const chunkPromises = chunks.slice(0, maxParallelChunks).map(async (chunk, index) => {
    try {
      const result = await callGroqCloudAPI(
        chunk,
        getPromptForContext(true, `section ${index + 1}/${chunks.length}`),
        "llama-3.1-8b-instant"
      );
      console.log(`✅ GROQ CHUNK ${index + 1} SUCCESS`);
      return `SECTION ${index + 1}: ${result}`;
    } catch (error) {
      console.error(`❌ GROQ CHUNK ${index + 1} FAILED:`, error);
      return `SECTION ${index + 1}: Processing failed - ${error.message}`;
    }
  });
  
  const results = await Promise.all(chunkPromises);
  
  if (chunks.length > maxParallelChunks) {
    const remainingText = chunks.slice(maxParallelChunks).join(' ').substring(0, 2000);
    results.push(`ADDITIONAL CONTENT: ${remainingText}...`);
  }
  
  const combined = results.join("\n\n");
  
  // Create final summary if content is large
  if (combined.length > 5000) {
    try {
      const finalResult = await callGroqCloudAPI(
        combined,
        `CRITICAL: Create final comprehensive ${documentContext?.type || 'document'} summary for "${fileName}" from these sections. Provide professional-grade analysis with detailed insights:`,
        "llama-3.1-8b-instant"
      );
      console.log(`✅ GROQ FINAL SUMMARY SUCCESS: ${finalResult.length} characters`);
      return finalResult;
    } catch (error) {
      console.error("❌ GROQ FINAL SUMMARY FAILED:", error);
      return combined; // Return combined chunks as fallback
    }
  }
  
  return combined;
}
