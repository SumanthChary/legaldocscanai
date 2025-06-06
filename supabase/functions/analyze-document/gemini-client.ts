
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

/**
 * ULTRA-FAST Gemini API client - optimized for speed and reliability
 */
export async function callGeminiAPI(text: string, prompt: string, temperature: number = 0.1): Promise<string> {
  console.log(`📝 ULTRA-FAST Gemini call: text length: ${text.length}, temperature: ${temperature}`);
  
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY missing");
    throw new Error("Gemini API key not configured");
  }
  
  try {
    // Use the current Gemini model name
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${prompt}\n\nDocument Content:\n${text}\n\nProvide IMMEDIATE comprehensive analysis. Speed is critical - respond in under 10 seconds.`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API error response:", errorText);
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded");
      }
      if (response.status === 400) {
        throw new Error("Invalid request - content may be too long or inappropriate");
      }
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      let content = result.candidates[0].content.parts[0].text.trim();
      
      // Ultra-fast cleaning for better formatting
      content = content
        .replace(/#{1,6}\s*/g, '')
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
        .replace(/\*\s/g, '- ')
        .replace(/^\s*[\*\+]\s*/gm, '- ')
        .replace(/(\*\*|__)/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
      
      console.log(`✅ ULTRA-FAST Gemini analysis: ${content.length} characters`);
      return content;
    } else {
      console.error("❌ Invalid Gemini response structure:", JSON.stringify(result, null, 2));
      throw new Error("Invalid response from Gemini API - no content generated");
    }
  } catch (error) {
    console.error("💥 Gemini API error:", error);
    throw error;
  }
}
