
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

/**
 * Makes the actual API call to Gemini, with proper error handling and enhanced configuration
 */
export async function callGeminiAPI(text: string, promptPrefix: string, temperature = 0.2): Promise<string> {
  console.log(`Calling Gemini API with text length: ${text.length}, temperature: ${temperature}`);
  
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
            """
            
            IMPORTANT INSTRUCTIONS:
            - Provide a comprehensive, detailed analysis
            - Use clear structure with headers and bullet points
            - Include ALL important information from the document
            - Prioritize by importance and relevance
            - Maintain professional, analytical tone
            - Be thorough but well-organized
            - Focus on actionable insights and key takeaways`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 8192, // Increased for more comprehensive summaries
          topP: 0.8, // Slightly reduced for more focused responses
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
    console.log("Gemini API response received, checking format...");
    
    // Extract the content from Gemini response
    if (
      result.candidates && 
      result.candidates[0]?.content?.parts && 
      result.candidates[0].content.parts[0]?.text
    ) {
      const summary = result.candidates[0].content.parts[0].text.trim();
      
      // Validate that we got a substantial response
      if (summary.length < 100) {
        console.warn("Received suspiciously short summary:", summary);
        throw new Error("Generated summary is too short, indicating potential processing issues");
      }
      
      console.log(`Successfully generated comprehensive summary: ${summary.length} characters`);
      return summary;
    } else {
      console.error("Unexpected Gemini response format:", JSON.stringify(result, null, 2));
      
      // Check for safety filter blocking
      if (result.candidates && result.candidates[0]?.finishReason === 'SAFETY') {
        throw new Error("Content was blocked by safety filters. Please try with a different document.");
      }
      
      throw new Error("Invalid response format from Gemini API - no content generated");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Provide more specific error messages
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
