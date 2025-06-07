
import { callGroqCloudAPI } from "../groqcloud-client.ts";

export async function processWithGroqUltraFast(text: string, fileName: string): Promise<string> {
  console.log("⚡ GroqCloud MAXIMUM SPEED processing - API CALL STARTING");
  
  const maxChunkSize = 5000;
  
  if (text.length <= maxChunkSize) {
    try {
      const result = await callGroqCloudAPI(
        text,
        "CRITICAL: Provide IMMEDIATE comprehensive analysis in under 5 seconds:",
        "llama-3.1-8b-instant"
      );
      console.log(`✅ GROQ API SUCCESS: Generated ${result.length} characters`);
      return result;
    } catch (error) {
      console.error("❌ GROQ API FAILED:", error);
      throw error;
    }
  }
  
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize));
  }
  
  console.log(`⚡ Processing ${chunks.length} chunks in ULTRA-FAST parallel mode`);
  
  const maxParallelChunks = Math.min(chunks.length, 4);
  const chunkPromises = chunks.slice(0, maxParallelChunks).map(async (chunk, index) => {
    try {
      const result = await callGroqCloudAPI(
        chunk,
        `URGENT: Analyze section ${index + 1}/${chunks.length} IMMEDIATELY:`,
        "llama-3.1-8b-instant"
      );
      console.log(`✅ GROQ CHUNK ${index + 1} SUCCESS`);
      return `SECTION ${index + 1}: ${result}`;
    } catch (error) {
      console.error(`❌ GROQ CHUNK ${index + 1} FAILED:`, error);
      throw error;
    }
  });
  
  const results = await Promise.all(chunkPromises);
  
  if (chunks.length > maxParallelChunks) {
    const remainingText = chunks.slice(maxParallelChunks).join(' ').substring(0, 2000);
    results.push(`ADDITIONAL CONTENT: ${remainingText}...`);
  }
  
  const combined = results.join("\n\n");
  
  if (combined.length > 5000) {
    try {
      const finalResult = await callGroqCloudAPI(
        combined,
        "CRITICAL: Create final comprehensive summary INSTANTLY:",
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
