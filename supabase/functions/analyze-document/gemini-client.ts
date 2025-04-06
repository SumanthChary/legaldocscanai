
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

/**
 * Makes the actual API call to Gemini, with proper error handling
 */
export async function callGeminiAPI(text: string, promptPrefix: string, temperature = 0.3): Promise<string> {
  console.log(`Calling Gemini API with text length: ${text.length}, temperature: ${temperature}`);
  
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
            
            Please provide a comprehensive and structured summary that captures ALL the key information.`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 4096,
          topP: 0.95,
          topK: 40
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
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Extract the content from Gemini response
    if (
      result.candidates && 
      result.candidates[0]?.content?.parts && 
      result.candidates[0].content.parts[0]?.text
    ) {
      const summary = result.candidates[0].content.parts[0].text.trim();
      console.log("Successfully generated summary:", summary.substring(0, 100) + "...");
      return summary;
    } else {
      console.error("Unexpected Gemini response format:", JSON.stringify(result));
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
