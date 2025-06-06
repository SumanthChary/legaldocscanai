
import { callGeminiAPI } from "../gemini-client.ts";

export async function processWithGeminiUltraFast(text: string, fileName: string): Promise<string> {
  console.log("📝 Gemini LIGHTNING-SPEED text processing");
  
  const prompt = `LIGHTNING DOCUMENT ANALYSIS - Respond in under 5 seconds:

CRITICAL REQUIREMENTS:
- Extract ALL key information IMMEDIATELY
- Provide comprehensive professional analysis
- Include main points, conclusions, and insights
- Use clear business format
- NO formatting symbols or markdown

URGENT: Analyze this document NOW:`;
  
  return await callGeminiAPI(text, prompt, 0.1);
}
