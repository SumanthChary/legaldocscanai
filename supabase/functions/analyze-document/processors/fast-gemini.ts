
import { callGeminiAPI } from "../gemini-client.ts";

export async function processWithGeminiUltraFast(text: string, fileName: string): Promise<string> {
  console.log("📝 Gemini LIGHTNING-SPEED text processing - API CALL STARTING");
  
  const prompt = `LIGHTNING DOCUMENT ANALYSIS - Respond in under 5 seconds:

CRITICAL REQUIREMENTS:
- Extract ALL key information IMMEDIATELY
- Provide comprehensive professional analysis
- Include main points, conclusions, and insights
- Use clear business format
- NO formatting symbols or markdown

URGENT: Analyze this document NOW:`;
  
  try {
    const result = await callGeminiAPI(text, prompt, 0.1);
    console.log(`✅ GEMINI API SUCCESS: Generated ${result.length} characters`);
    return result;
  } catch (error) {
    console.error("❌ GEMINI API FAILED:", error);
    throw error;
  }
}
