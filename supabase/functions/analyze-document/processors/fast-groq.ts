
import { callGroqCloudAPI } from "../groqcloud-client.ts";

export async function processWithGroqUltraFast(text: string, fileName: string): Promise<string> {
  console.log("⚡ GroqCloud MAXIMUM SPEED processing - API CALL STARTING");
  console.log(`🔑 GroqCloud API Key available: ${!!Deno.env.get('GROQCLOUD_API_KEY')}`);
  
  const maxChunkSize = 5000;
  
  if (text.length <= maxChunkSize) {
    try {
      console.log("🚀 Processing single chunk with GroqCloud...");
      const result = await callGroqCloudAPI(
        text,
        `CRITICAL: Provide IMMEDIATE comprehensive analysis for document "${fileName}". Include key points, main content, insights, and actionable information:`,
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
        `URGENT: Analyze section ${index + 1}/${chunks.length} of document "${fileName}" IMMEDIATELY. Extract key information:`,
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
        `CRITICAL: Create final comprehensive summary for document "${fileName}" from these sections:`,
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
