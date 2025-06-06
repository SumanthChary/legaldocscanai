
import { extractAndValidateText } from "./text-processing.ts";
import { processWithGroqVision } from "./processors/vision-processor.ts";
import { processWithGeminiUltraFast } from "./processors/fast-gemini.ts";
import { processWithGroqUltraFast } from "./processors/fast-groq.ts";
import { generateEmergencySummary, formatUltraFastResult } from "./utils/emergency-fallback.ts";
import { callGroqCloudAPI } from "./groqcloud-client.ts";

export async function processUltraFast(text: string, fileName: string, fileBuffer?: ArrayBuffer): Promise<string> {
  console.log(`🚀 ULTRA-FAST processing: ${fileName} (${text.length} chars)`);
  
  const startTime = Date.now();
  
  try {
    const cleanedText = extractAndValidateText(text, fileName);
    const fileExtension = fileName.toLowerCase().split('.').pop() || '';
    
    const isTextFile = ['txt', 'doc', 'docx', 'rtf'].includes(fileExtension);
    const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    let result: string;
    
    if (isImageFile || (isPDF && fileBuffer)) {
      console.log(`🖼️ Using GroqCloud Vision for ${fileExtension}`);
      result = await processWithGroqVision(cleanedText, fileBuffer!, fileExtension);
    } else if (isTextFile && cleanedText.length < 10000) {
      console.log(`📝 Using Gemini for text file: ${fileExtension}`);
      try {
        result = await processWithGeminiUltraFast(cleanedText, fileName);
      } catch (geminiError) {
        console.log("🔄 Gemini failed, switching to GroqCloud INSTANTLY");
        result = await processWithGroqUltraFast(cleanedText, fileName);
      }
    } else {
      console.log(`⚡ Using GroqCloud for: ${fileExtension}`);
      result = await processWithGroqUltraFast(cleanedText, fileName);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ ULTRA-FAST processing complete in ${processingTime}ms`);
    
    return formatUltraFastResult(result, fileName, fileExtension, processingTime);
    
  } catch (error) {
    console.error("💥 Ultra-fast processing error:", error);
    
    // GUARANTEED TRIPLE FALLBACK
    try {
      console.log("🔄 Emergency fallback #1: GroqCloud Instant");
      const shortText = text.substring(0, 4000);
      const result = await callGroqCloudAPI(
        shortText, 
        "CRITICAL: Provide IMMEDIATE comprehensive analysis in under 5 seconds:", 
        "llama-3.1-8b-instant"
      );
      return formatUltraFastResult(result, fileName, "emergency", Date.now() - startTime);
    } catch (fallbackError1) {
      console.error("💥 First fallback failed, trying SUPER FAST alternative");
      
      try {
        const veryShortText = text.substring(0, 2000);
        const result = await callGroqCloudAPI(
          veryShortText, 
          "URGENT: Quick analysis needed NOW:", 
          "llama-3.1-8b-instant"
        );
        return formatUltraFastResult(result, fileName, "fast", Date.now() - startTime);
      } catch (fallbackError2) {
        console.error("💥 Second fallback failed, using EMERGENCY mode");
        
        try {
          const basicText = text.substring(0, 1000);
          const result = await callGroqCloudAPI(
            basicText,
            "Emergency analysis:",
            "llama-3.1-8b-instant"
          );
          return formatUltraFastResult(result, fileName, "basic", Date.now() - startTime);
        } catch (finalError) {
          console.error("💥 All AI methods failed, generating emergency summary");
          return formatUltraFastResult(
            generateEmergencySummary(text, fileName),
            fileName, 
            "emergency", 
            Date.now() - startTime
          );
        }
      }
    }
  }
}
