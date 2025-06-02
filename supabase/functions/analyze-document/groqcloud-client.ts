
const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

/**
 * GroqCloud API client for enhanced document analysis
 */
export async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
  console.log(`Calling GroqCloud API with model: ${model}, text length: ${text.length}`);
  
  if (!GROQCLOUD_API_KEY) {
    throw new Error("GROQCLOUD_API_KEY environment variable is not set");
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
            content: `You are a professional legal document analyst. Provide comprehensive, detailed analysis without using symbols like #, *, or markdown formatting. Use clear professional language with proper structure.`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\n${text}\n\nProvide a detailed professional analysis without using symbols like #, *, or special formatting. Use clear headings and bullet points with regular text formatting.`
          }
        ],
        temperature: 0.2,
        max_tokens: 8192,
        top_p: 0.8,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GroqCloud API error response:", errorText);
      throw new Error(`GroqCloud API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      let content = result.choices[0].message.content.trim();
      
      // Clean up unwanted symbols and formatting
      content = content
        .replace(/#{1,6}\s*/g, '') // Remove markdown headers
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic
        .replace(/^\s*[\*\-\+]\s*/gm, '• ') // Convert markdown lists to bullet points
        .replace(/\n{3,}/g, '\n\n') // Clean excessive line breaks
        .trim();
      
      console.log(`GroqCloud analysis completed: ${content.length} characters`);
      return content;
    } else {
      console.error("Unexpected GroqCloud response format:", JSON.stringify(result, null, 2));
      throw new Error("Invalid response format from GroqCloud API");
    }
  } catch (error) {
    console.error("Error calling GroqCloud API:", error);
    throw error;
  }
}

/**
 * Vision-enabled analysis for documents with images
 */
export async function analyzeWithVision(imageData: string, text: string): Promise<string> {
  console.log("Starting vision analysis with GroqCloud");
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQCLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-vision-free", // Use vision model for image analysis
        messages: [
          {
            role: "system",
            content: "You are a professional legal document analyst with vision capabilities. Analyze both text and visual content. Provide comprehensive analysis without using symbols like #, *, or markdown formatting."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this document comprehensively. Extract and analyze all text content from images, charts, tables, and diagrams. Combined with the extracted text: ${text}\n\nProvide detailed professional analysis without special formatting symbols.`
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
        temperature: 0.2,
        max_tokens: 8192
      })
    });

    if (!response.ok) {
      throw new Error(`Vision analysis failed: ${response.status}`);
    }

    const result = await response.json();
    let content = result.choices[0].message.content.trim();
    
    // Clean formatting
    content = content
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/^\s*[\*\-\+]\s*/gm, '• ')
      .trim();
    
    return content;
  } catch (error) {
    console.error("Vision analysis error:", error);
    throw error;
  }
}

/**
 * Get best model for document type
 */
export function getBestModel(documentType: string, hasImages: boolean): string {
  if (hasImages) {
    return "llama-vision-free";
  }
  
  switch (documentType) {
    case 'legal':
      return "llama-3.3-70b-versatile"; // Best for complex legal analysis
    case 'business':
      return "llama-3.1-70b-versatile"; // Good for business documents
    case 'technical':
      return "qwen-qwq-32b-preview"; // Reasoning model for technical docs
    default:
      return "llama-3.3-70b-versatile"; // Default high-quality model
  }
}
