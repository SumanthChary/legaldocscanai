
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

/**
 * ULTRA-FAST Gemini API client optimized for text documents
 */
export async function callGeminiAPI(text: string, promptPrefix: string, temperature = 0.1): Promise<string> {
  console.log(`📝 ULTRA-FAST Gemini call: text length: ${text.length}, temperature: ${temperature}`);
  
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${promptPrefix}
            
            ${text}
            
            ULTRA-FAST ANALYSIS REQUIREMENTS:
            - Respond in under 10 seconds
            - Provide comprehensive, detailed analysis
            - Extract ALL important information
            - Use clear structure with bullet points
            - Professional, analytical tone
            - Focus on actionable insights
            - Be thorough but concise`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 3000, // Optimized for speed
          topP: 0.8,
          topK: 40,
          candidateCount: 1,
          stopSequences: []
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Gemini API response received, processing...");
    
    if (
      result.candidates && 
      result.candidates[0]?.content?.parts && 
      result.candidates[0].content.parts[0]?.text
    ) {
      const summary = result.candidates[0].content.parts[0].text.trim();
      
      if (summary.length < 50) {
        console.warn("Received short summary:", summary);
        throw new Error("Generated summary is too short");
      }
      
      console.log(`✅ ULTRA-FAST Gemini analysis: ${summary.length} characters`);
      return summary;
    } else {
      console.error("Unexpected Gemini response format:", JSON.stringify(result, null, 2));
      
      if (result.candidates && result.candidates[0]?.finishReason === 'SAFETY') {
        throw new Error("Content was blocked by safety filters. Please try with a different document.");
      }
      
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    if (error.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error("API quota exceeded. Please try again later or contact support.");
    } else if (error.message?.includes('INVALID_API_KEY')) {
      throw new Error("Invalid API key configuration. Please contact support.");
    } else if (error.message?.includes('timeout')) {
      throw new Error("Request timed out. Please try with a smaller document or try again later.");
    }
    
    throw error;
  }
}

/**
 * Enhanced function to determine document type and select appropriate analysis approach
 */
export function getDocumentContext(text: string, fileName: string): { type: string, approach: string } {
  const lowerText = text.toLowerCase();
  const lowerFileName = fileName.toLowerCase();
  
  // Legal document indicators
  const legalIndicators = [
    'contract', 'agreement', 'terms', 'conditions', 'legal', 'law', 'court',
    'whereas', 'party', 'parties', 'jurisdiction', 'governing law', 'liability',
    'indemnify', 'breach', 'terminate', 'clause', 'provision', 'hereby'
  ];
  
  // Business document indicators
  const businessIndicators = [
    'business', 'strategy', 'revenue', 'profit', 'market', 'customer',
    'proposal', 'plan', 'budget', 'forecast', 'roi', 'kpi', 'analysis'
  ];
  
  // Technical document indicators
  const technicalIndicators = [
    'technical', 'specification', 'procedure', 'manual', 'guide',
    'implementation', 'system', 'software', 'hardware', 'process'
  ];
  
  const legalScore = legalIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 1 : 0), 0);
  const businessScore = businessIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 1 : 0), 0);
  const technicalScore = technicalIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 1 : 0), 0);
  
  if (legalScore >= businessScore && legalScore >= technicalScore && legalScore > 2) {
    return { type: 'legal', approach: 'detailed_legal' };
  } else if (businessScore >= technicalScore && businessScore > 2) {
    return { type: 'business', approach: 'comprehensive_business' };
  } else if (technicalScore > 2) {
    return { type: 'technical', approach: 'structured_technical' };
  }
  
  return { type: 'general', approach: 'comprehensive_general' };
}
