
const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

/**
 * Ultra-fast GroqCloud API client optimized for speed
 */
export async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
  console.log(`⚡ Lightning GroqCloud call: ${model}, text: ${text.length} chars`);
  
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
            content: `You are a lightning-fast professional document analyst. Provide comprehensive analysis in clean format. 

STRICT RULES:
- NO hash symbols (#) for headings
- NO asterisks (*) for emphasis
- Use dash (-) for bullet points
- Use clear section breaks
- Professional business language
- Quick comprehensive analysis
- Focus on key insights`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nDocument Content:\n${text}\n\nProvide fast comprehensive analysis. No formatting symbols.`
          }
        ],
        temperature: 0.1,
        max_tokens: 4096, // Optimized for speed
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
      
      // Ultra-fast cleaning
      content = content
        .replace(/#{1,6}\s*/g, '')
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
        .replace(/\*\s/g, '- ')
        .replace(/^\s*[\*\+]\s*/gm, '- ')
        .replace(/(\*\*|__)/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
      
      console.log(`✅ GroqCloud analysis completed: ${content.length} characters`);
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
 * Lightning-fast vision analysis for images and PDFs
 */
export async function analyzeWithVision(imageData: string, text: string): Promise<string> {
  console.log("🖼️ Starting lightning vision analysis");
  
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
            content: `Lightning-fast professional document analyst with vision.

RULES:
- NO formatting symbols
- Professional analysis
- Extract ALL text and visual content
- Quick comprehensive insights`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Rapidly analyze this document. Extract ALL text, analyze charts/images/tables. Combined with text: ${text}\n\nProvide lightning-fast comprehensive analysis.`
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
        max_tokens: 4096
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
    
    console.log("✅ Lightning vision analysis complete");
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
