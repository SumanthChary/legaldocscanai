
import { callGeminiAPI } from "../gemini-client.ts";

export async function processWithGeminiUltraFast(text: string, fileName: string): Promise<string> {
  console.log("📝 Gemini LIGHTNING-SPEED text processing - API CALL STARTING");
  console.log(`🔑 Gemini API Key available: ${!!Deno.env.get('GEMINI_API_KEY')}`);
  
  const prompt = `LIGHTNING DOCUMENT ANALYSIS - Respond in under 5 seconds:

CRITICAL REQUIREMENTS:
- Extract ALL key information IMMEDIATELY
- Provide comprehensive professional analysis
- Include main points, conclusions, and insights
- Use clear business format
- NO formatting symbols or markdown

DOCUMENT TO ANALYZE: "${fileName}"

URGENT: Analyze this document content NOW:

${text}

Provide a detailed professional summary with key points, main content, and actionable insights.`;
  
  try {
    console.log("🚀 Calling Gemini API...");
    const result = await callGeminiAPI(text, prompt, 0.1);
    console.log(`✅ GEMINI API SUCCESS: Generated ${result.length} characters`);
    
    if (!result || result.trim().length === 0) {
      throw new Error("Gemini returned empty response");
    }
    
    return result;
  } catch (error) {
    console.error("❌ GEMINI API FAILED:", error);
    console.error("❌ API Key exists:", !!Deno.env.get('GEMINI_API_KEY'));
    throw new Error(`Gemini API failed: ${error.message}`);
  }
}
