
import { callGeminiAPI } from "../gemini-client.ts";

export async function processWithGeminiUltraFast(text: string, fileName: string, documentContext?: any): Promise<string> {
  console.log("📝 Gemini LIGHTNING-SPEED text processing - API CALL STARTING");
  console.log(`🔑 Gemini API Key available: ${!!Deno.env.get('GEMINI_API_KEY')}`);
  
  // Use specialized prompt based on document type
  let prompt: string;
  if (documentContext?.type === 'legal') {
    prompt = `PROFESSIONAL LEGAL ANALYSIS - Respond comprehensively in under 10 seconds:

⚖️ CRITICAL LEGAL REQUIREMENTS:
- Extract ALL key legal provisions and clauses
- Identify parties, obligations, and rights 
- Highlight critical deadlines and compliance requirements
- Assess risks, liabilities, and legal implications
- Provide clause-by-clause breakdown for essential provisions
- Include actionable legal recommendations

DOCUMENT TO ANALYZE: "${fileName}"

URGENT: Analyze this legal document content NOW providing professional-grade legal insights:

${text}

Provide detailed professional legal analysis with specific clauses, implications, and strategic recommendations.`;
  } else if (documentContext?.type === 'business') {
    prompt = `PROFESSIONAL BUSINESS ANALYSIS - Respond comprehensively in under 10 seconds:

📊 CRITICAL BUSINESS REQUIREMENTS:
- Extract ALL key business elements and strategic information
- Identify financial implications and operational impacts
- Highlight performance metrics and success factors
- Assess business risks and opportunities
- Provide actionable business recommendations
- Include strategic insights and competitive analysis

DOCUMENT TO ANALYZE: "${fileName}"

URGENT: Analyze this business document content NOW providing professional-grade business insights:

${text}

Provide detailed professional business analysis with specific metrics, implications, and strategic recommendations.`;
  } else {
    prompt = `PROFESSIONAL DOCUMENT ANALYSIS - Respond comprehensively in under 10 seconds:

🎯 CRITICAL ANALYSIS REQUIREMENTS:
- Extract ALL key information with detailed breakdown
- Provide comprehensive professional analysis
- Include main points, conclusions, and strategic insights
- Assess implications and actionable recommendations
- Use clear professional structure
- Focus on value-adding insights professionals would pay for

DOCUMENT TO ANALYZE: "${fileName}"

URGENT: Analyze this document content NOW providing professional-grade detailed insights:

${text}

Provide comprehensive professional analysis with specific details, implications, and actionable recommendations.`;
  }
  
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
