
import { extractAndValidateText } from "./text-processing.ts";
import { processWithGroqVision } from "./processors/vision-processor.ts";
import { processWithGeminiUltraFast } from "./processors/fast-gemini.ts";
import { processWithGroqUltraFast } from "./processors/fast-groq.ts";
import { generateEmergencySummary, formatUltraFastResult } from "./utils/emergency-fallback.ts";

export async function processUltraFast(text: string, fileName: string, fileBuffer?: ArrayBuffer): Promise<string> {
  console.log(`🚀 ULTRA-FAST processing: ${fileName} (${text.length} chars)`);
  console.log(`🔑 API Keys available - Gemini: ${!!Deno.env.get('GEMINI_API_KEY')}, GroqCloud: ${!!Deno.env.get('GROQCLOUD_API_KEY')}`);
  
  const startTime = Date.now();
  
  try {
    const cleanedText = extractAndValidateText(text, fileName);
    const fileExtension = fileName.toLowerCase().split('.').pop() || '';
    
    console.log(`📄 Processing ${fileExtension} file with ${cleanedText.length} characters`);
    
    const isTextFile = ['txt', 'doc', 'docx', 'rtf'].includes(fileExtension);
    const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    let result: string;
    
    // Try AI processing in order of preference
    if (isImageFile || (isPDF && fileBuffer)) {
      console.log(`🖼️ Using GroqCloud Vision for ${fileExtension}`);
      result = await processWithGroqVision(cleanedText, fileBuffer!, fileExtension);
    } else {
      // Try Gemini first for text documents
      console.log(`📝 Attempting Gemini processing for: ${fileExtension}`);
      try {
        result = await processWithGeminiUltraFast(cleanedText, fileName);
        console.log(`✅ Gemini processing successful`);
      } catch (geminiError) {
        console.log("🔄 Gemini failed, switching to GroqCloud:", geminiError.message);
        try {
          result = await processWithGroqUltraFast(cleanedText, fileName);
          console.log(`✅ GroqCloud processing successful`);
        } catch (groqError) {
          console.error("💥 Both AI services failed:", groqError.message);
          throw new Error(`All AI services failed: Gemini: ${geminiError.message}, GroqCloud: ${groqError.message}`);
        }
      }
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ ULTRA-FAST processing complete in ${processingTime}ms`);
    
    return formatUltraFastResult(result, fileName, fileExtension, processingTime);
    
  } catch (error) {
    console.error("💥 Ultra-fast processing error:", error);
    
    // Generate comprehensive emergency summary
    const processingTime = Date.now() - startTime;
    const emergencySummary = generateEmergencySummary(text, fileName);
    
    console.log("🚨 Using emergency fallback summary");
    return formatUltraFastResult(emergencySummary, fileName, "emergency", processingTime);
  }
}
