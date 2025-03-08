
const GEMINI_API_KEY = "AIzaSyBinsVgP06EqfLE-jd0hn2FLMCcUa7Wt1g";

// Optimized Gemini analysis function
export async function analyzeWithGemini(text: string): Promise<string> {
  console.log("Analyzing with Gemini...");
  
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Summarize this in 2-3 sentences:
          
          ${text}`
        }]
      }],
      generationConfig: {
        temperature: 0.0, // Set to 0 for most deterministic response
        maxOutputTokens: 256, // Reduced token count for faster responses
      }
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
    return result.candidates[0].content.parts[0].text;
  } else {
    console.error("Unexpected Gemini response format:", JSON.stringify(result));
    throw new Error("Invalid response format from Gemini API");
  }
}
