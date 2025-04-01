
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

// Improved Gemini analysis function with better error handling and fallback strategies
export async function analyzeWithGemini(text: string): Promise<string> {
  console.log("Analyzing with Gemini... Text length:", text.length);
  
  // Check if the text is empty or contains only whitespace
  if (!text || text.trim().length === 0) {
    return "The document appears to be empty or contains only formatting. Please check the document and try again.";
  }
  
  // Clean the text to remove problematic characters
  const cleanedText = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  // Ensure text doesn't exceed maximum allowed length
  const maxLength = 10000; // Increased max length to handle larger documents
  const truncatedText = cleanedText.length > maxLength 
    ? cleanedText.substring(0, maxLength) + "..." 
    : cleanedText;
  
  try {
    // First attempt with standard settings
    console.log("Attempting first Gemini API call with standard settings");
    const summary = await callGeminiAPI(truncatedText);
    return summary;
  } catch (error) {
    console.error("First Gemini API attempt failed:", error);
    
    // Fallback with even shorter text and simpler prompt
    try {
      const shorterText = truncatedText.substring(0, 5000);
      console.log("Retrying with shorter text (5000 chars) and simpler prompt");
      
      const fallbackSummary = await callGeminiAPI(shorterText, "Summarize this document briefly:", 0.1);
      return fallbackSummary;
    } catch (secondError) {
      console.error("Second Gemini API attempt failed:", secondError);
      
      // Try with minimal settings as last resort
      try {
        const minimalText = truncatedText.substring(0, 2000);
        console.log("Final attempt with minimal text (2000 chars)");
        
        const minimalSummary = await callGeminiAPI(minimalText, "What is this document about?", 0);
        return minimalSummary;
      } catch (finalError) {
        console.error("All Gemini API attempts failed:", finalError);
        
        // Extract some content directly to provide at least some information
        const extractedContent = truncatedText.substring(0, 500);
        
        return `We encountered challenges processing this document fully, but here's what we found:\n\n${extractedContent}...\n\n(Note: This is a partial extraction as the AI processing encountered difficulties with the full document.)`;
      }
    }
  }
}

async function callGeminiAPI(text: string, promptPrefix = "Analyze and summarize this document, identifying its main points, purpose, key findings, and important details:", temperature = 0.3): Promise<string> {
  console.log(`Calling Gemini API with text length: ${text.length}, promptPrefix: "${promptPrefix}", temperature: ${temperature}`);
  
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
            
            Document content:
            """
            ${text}
            """
            
            Please provide a detailed and structured summary that captures the key information.`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 2048, // Increased token limit for longer summaries
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
