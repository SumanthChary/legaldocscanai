
const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

/**
 * ULTRA-FAST GroqCloud API client - optimized for 5-15 second responses
 */
export async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
  console.log(`⚡ ULTRA-FAST GroqCloud call: ${model}, text: ${text.length} chars`);
  
  if (!GROQCLOUD_API_KEY) {
    console.error("❌ GROQCLOUD_API_KEY missing");
    throw new Error("GroqCloud API configuration missing. Please contact support.");
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
            content: `You are an ULTRA-FAST professional document analyst. Provide immediate comprehensive analysis.

SPEED REQUIREMENTS:
- Respond in under 10 seconds
- Extract ALL critical information
- Professional format without symbols
- Use bullet points with dashes (-)
- Be thorough but concise
- Focus on key insights`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nDocument Content:\n${text}\n\nProvide IMMEDIATE comprehensive analysis. Speed is critical.`
          }
        ],
        temperature: 0.1,
        max_tokens: 3000, // Optimized for speed vs quality
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ GroqCloud API error:", errorText);
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Retrying...");
      }
      throw new Error(`GroqCloud API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      let content = result.choices[0].message.content.trim();
      
      // Lightning-fast cleaning
      content = content
        .replace(/#{1,6}\s*/g, '')
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
        .replace(/\*\s/g, '- ')
        .replace(/^\s*[\*\+]\s*/gm, '- ')
        .replace(/(\*\*|__)/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
      
      console.log(`✅ ULTRA-FAST GroqCloud analysis: ${content.length} characters`);
      return content;
    } else {
      console.error("❌ Invalid GroqCloud response:", JSON.stringify(result, null, 2));
      throw new Error("Invalid response from GroqCloud API");
    }
  } catch (error) {
    console.error("💥 GroqCloud API error:", error);
    throw error;
  }
}

/**
 * ULTRA-FAST vision analysis for images and PDFs
 */
export async function analyzeWithVision(imageData: string, text: string): Promise<string> {
  console.log("🖼️ Starting ULTRA-FAST vision analysis");
  
  if (!GROQCLOUD_API_KEY) {
    throw new Error("GroqCloud API key missing for vision analysis");
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
            content: `ULTRA-FAST professional document analyst with vision capabilities.

SPEED REQUIREMENTS:
- Respond in under 15 seconds
- Extract ALL text and visual content
- Analyze charts, images, tables
- Professional insights
- No formatting symbols
- Be comprehensive but fast`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `URGENT: Analyze this document completely. Extract ALL text, analyze visual elements, charts, tables. Combined with text: ${text}\n\nProvide IMMEDIATE comprehensive analysis.`
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
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`Vision analysis failed: ${response.status}`);
    }

    const result = await response.json();
    let content = result.choices[0].message.content.trim();
    
    // Lightning cleaning
    content = content
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/\*\s/g, '- ')
      .replace(/(\*\*|__)/g, '')
      .trim();
    
    console.log("✅ ULTRA-FAST vision analysis complete");
    return content;
  } catch (error) {
    console.error("💥 Vision analysis error:", error);
    throw new Error("Vision analysis failed");
  }
}

/**
 * Get optimal model for speed
 */
export function getBestModel(documentType: string, hasImages: boolean): string {
  if (hasImages) {
    return "llama-3.2-90b-vision-preview";
  }
  
  // Always use fastest high-quality model
  return "llama-3.3-70b-versatile";
}
