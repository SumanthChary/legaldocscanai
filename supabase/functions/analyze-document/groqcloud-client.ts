
const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

/**
 * ULTRA-FAST GroqCloud API client - optimized for MAXIMUM SPEED
 */
export async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.1-8b-instant"): Promise<string> {
  console.log(`⚡ ULTRA-FAST GroqCloud call: ${model}, text: ${text.length} chars`);
  
  if (!GROQCLOUD_API_KEY) {
    console.error("❌ GROQCLOUD_API_KEY missing");
    throw new Error("GroqCloud API key not configured");
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
            content: "You are an expert document analyst. Provide comprehensive, detailed analysis INSTANTLY. Use clear professional format without any formatting symbols. Be thorough but fast."
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nDocument Content:\n${text}\n\nProvide IMMEDIATE comprehensive analysis. Speed is CRITICAL - respond in under 5 seconds with detailed insights.`
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ GroqCloud API error:", errorText);
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded");
      }
      if (response.status === 400) {
        throw new Error("Invalid request - content may be too long");
      }
      throw new Error(`GroqCloud API error: ${response.status} - ${errorText}`);
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
 * ULTRA-FAST Vision analysis with GroqCloud
 */
export async function analyzeWithVision(base64Data: string, additionalText?: string): Promise<string> {
  console.log(`🖼️ ULTRA-FAST Vision analysis starting`);
  
  if (!GROQCLOUD_API_KEY) {
    throw new Error("GroqCloud API key not configured for vision analysis");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQCLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert document analyst specializing in visual document analysis. Provide comprehensive, detailed analysis of images and documents INSTANTLY. Extract ALL text, analyze content, identify key information, and provide professional insights. Use clear format without formatting symbols."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `URGENT VISUAL DOCUMENT ANALYSIS - Respond INSTANTLY:

CRITICAL REQUIREMENTS:
- Extract ALL visible text completely
- Analyze document structure and layout
- Identify key information, data, and insights
- Provide comprehensive professional analysis
- Include important details and conclusions
- Use clear business format
- NO formatting symbols

${additionalText ? `Additional Context: ${additionalText}` : ""}

Analyze this document/image immediately and provide detailed insights:`
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Data
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ GroqCloud Vision error:", errorText);
      throw new Error(`Vision analysis failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      let content = result.choices[0].message.content.trim();
      
      // Clean formatting
      content = content
        .replace(/#{1,6}\s*/g, '')
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
        .replace(/\*\s/g, '- ')
        .replace(/^\s*[\*\+]\s*/gm, '- ')
        .replace(/(\*\*|__)/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
      
      console.log(`✅ ULTRA-FAST Vision analysis complete: ${content.length} characters`);
      return content;
    } else {
      throw new Error("Invalid response from vision analysis");
    }
  } catch (error) {
    console.error("💥 Vision analysis error:", error);
    throw error;
  }
}
