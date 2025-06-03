
const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

/**
 * GroqCloud API client for enhanced document analysis
 */
export async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
  console.log(`Calling GroqCloud API with model: ${model}, text length: ${text.length}`);
  
  if (!GROQCLOUD_API_KEY) {
    console.error("GROQCLOUD_API_KEY environment variable is not set");
    throw new Error("GroqCloud API configuration is missing. Please contact support.");
  }
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQCLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are a professional legal document analyst. Provide comprehensive analysis in clean, professional format. 
            
            STRICT FORMATTING RULES:
            - NEVER use hash symbols (#) for headings
            - NEVER use asterisks (*) for emphasis or lists
            - Use simple bullet points with dash (-)
            - Use clear section breaks with line spacing
            - Write in professional business language
            - Use proper paragraphs and sentence structure
            - No markdown formatting whatsoever
            
            Structure your analysis with clear sections like:
            EXECUTIVE SUMMARY
            KEY FINDINGS
            RECOMMENDATIONS
            RISK ASSESSMENT
            
            Use professional language suitable for legal professionals.`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nDocument Content:\n${text}\n\nProvide detailed professional analysis following the strict formatting rules. No hash symbols, no asterisks, no markdown. Use clear headings and professional structure.`
          }
        ],
        temperature: 0.1,
        max_tokens: 8192,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GroqCloud API error response:", errorText);
      
      if (response.status === 401) {
        throw new Error("Authentication failed with GroqCloud API. Please check your API key.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 503) {
        throw new Error("GroqCloud service temporarily unavailable. Please try again.");
      } else {
        throw new Error(`GroqCloud API error: ${response.status} ${response.statusText}`);
      }
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      let content = result.choices[0].message.content.trim();
      
      // Aggressively clean unwanted symbols and formatting
      content = content
        .replace(/#{1,6}\s*/g, '') // Remove all markdown headers
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // Remove all bold/italic
        .replace(/\*\s/g, '- ') // Convert asterisk lists to dashes
        .replace(/^\s*[\*\+]\s*/gm, '- ') // Convert markdown lists to dash lists
        .replace(/\n{3,}/g, '\n\n') // Clean excessive line breaks
        .replace(/(\*\*|__)/g, '') // Remove any remaining emphasis markers
        .replace(/`([^`]+)`/g, '$1') // Remove backticks
        .trim();
      
      console.log(`GroqCloud analysis completed successfully: ${content.length} characters`);
      return content;
    } else {
      console.error("Unexpected GroqCloud response format:", JSON.stringify(result, null, 2));
      throw new Error("Invalid response format from GroqCloud API");
    }
  } catch (error) {
    console.error("Error calling GroqCloud API:", error);
    if (error.message.includes('fetch')) {
      throw new Error("Network error connecting to GroqCloud. Please check your internet connection and try again.");
    }
    throw error;
  }
}

/**
 * Vision-enabled analysis for documents with images
 */
export async function analyzeWithVision(imageData: string, text: string): Promise<string> {
  console.log("Starting vision analysis with GroqCloud");
  
  if (!GROQCLOUD_API_KEY) {
    throw new Error("GroqCloud API configuration is missing for vision analysis.");
  }
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQCLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.2-90b-vision-preview",
        messages: [
          {
            role: "system",
            content: `You are a professional legal document analyst with vision capabilities. 
            
            STRICT FORMATTING RULES:
            - NEVER use hash symbols (#) for headings
            - NEVER use asterisks (*) for emphasis or lists
            - Use simple bullet points with dash (-)
            - Use clear section breaks with line spacing
            - Write in professional business language
            - No markdown formatting whatsoever
            
            Analyze both text and visual content comprehensively.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this document comprehensively. Extract and analyze all text content from images, charts, tables, and diagrams. Combined with the extracted text: ${text}\n\nProvide detailed professional analysis following strict formatting rules. No symbols, no markdown.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 8192
      })
    });

    if (!response.ok) {
      console.error(`Vision analysis failed: ${response.status} ${response.statusText}`);
      throw new Error(`Vision analysis failed: ${response.status}`);
    }

    const result = await response.json();
    let content = result.choices[0].message.content.trim();
    
    // Clean formatting aggressively
    content = content
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/\*\s/g, '- ')
      .replace(/^\s*[\*\+]\s*/gm, '- ')
      .replace(/(\*\*|__)/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
    
    console.log("Vision analysis completed successfully");
    return content;
  } catch (error) {
    console.error("Vision analysis error:", error);
    throw new Error("Vision analysis failed. Falling back to text-only analysis.");
  }
}

/**
 * Get best model for document type
 */
export function getBestModel(documentType: string, hasImages: boolean): string {
  if (hasImages) {
    return "llama-3.2-90b-vision-preview";
  }
  
  switch (documentType) {
    case 'legal':
      return "llama-3.3-70b-versatile";
    case 'business':
      return "llama-3.1-70b-versatile";
    case 'technical':
      return "llama-3.3-70b-versatile";
    default:
      return "llama-3.3-70b-versatile";
  }
}
