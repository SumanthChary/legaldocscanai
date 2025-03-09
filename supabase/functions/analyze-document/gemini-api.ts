
const GEMINI_API_KEY = "AIzaSyBinsVgP06EqfLE-jd0hn2FLMCcUa7Wt1g";

// Improved Gemini analysis function with better error handling and fallback
export async function analyzeWithGemini(text: string): Promise<string> {
  console.log("Analyzing with Gemini... Text length:", text.length);
  
  // Ensure text doesn't exceed maximum allowed length
  const maxLength = 4000; // Significantly reduced for more reliable processing
  const truncatedText = text.length > maxLength 
    ? text.substring(0, maxLength) + "..." 
    : text;
  
  try {
    // First attempt with standard settings
    const summary = await callGeminiAPI(truncatedText);
    return summary;
  } catch (error) {
    console.error("First Gemini API attempt failed:", error);
    
    // Fallback with even shorter text and simpler prompt
    try {
      const shorterText = truncatedText.substring(0, 2000);
      console.log("Retrying with shorter text (2000 chars)");
      
      const fallbackSummary = await callGeminiAPI(shorterText, "Summarize this briefly:", 0.1);
      return fallbackSummary;
    } catch (secondError) {
      console.error("Second Gemini API attempt failed:", secondError);
      
      // Last resort fallback if all API calls fail
      return "The document was processed, but we were unable to generate a summary. The content may be too complex or in an unsupported format.";
    }
  }
}

async function callGeminiAPI(text: string, promptPrefix = "Summarize this in 2-3 sentences:", temperature = 0.0): Promise<string> {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${promptPrefix}
          
          ${text}`
        }]
      }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 256,
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
}
