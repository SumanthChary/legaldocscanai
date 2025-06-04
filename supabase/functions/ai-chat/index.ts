
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * GroqCloud API client for chat functionality
 */
async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log(`AI Chat request from user: ${userId}`);

    if (!message || !userId) {
      throw new Error("Message and userId are required");
    }

    // Initialize Supabase client to get user's documents
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's recent documents for context
    const { data: userDocuments, error: docsError } = await supabase
      .from('document_analyses')
      .select('*')
      .eq('user_id', userId)
      .eq('analysis_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5);

    if (docsError) {
      console.error('Error fetching user documents:', docsError);
    }

    // Build context from user's documents
    let documentContext = "";
    if (userDocuments && userDocuments.length > 0) {
      documentContext = `\n\nUser's Recent Documents Context:\n`;
      userDocuments.forEach((doc, index) => {
        documentContext += `${index + 1}. Document: ${doc.original_name}\n`;
        if (doc.summary) {
          documentContext += `   Analysis: ${doc.summary.substring(0, 800)}...\n\n`;
        }
      });
    }

    const systemPrompt = `You are a professional legal AI assistant with expertise in legal document analysis and law. You have access to the user's recently analyzed documents and can provide detailed insights about them.

STRICT RESPONSE FORMATTING RULES:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists  
- Use simple bullet points with dash (-)
- Use clear section breaks with line spacing
- Write in professional business language
- No markdown formatting whatsoever

Your capabilities include:
- Analyzing legal documents and contracts
- Explaining legal concepts and terms
- Providing insights about compliance and risk factors
- Answering questions about recently uploaded documents
- Offering strategic legal advice (while noting this is not formal legal counsel)

Always provide professional, clear responses using proper paragraph structure and simple dash bullet points.

${documentContext}

Remember to be helpful, professional, and accurate. If referencing specific documents, mention them by name.`;

    const response = await callGroqCloudAPI(
      message,
      systemPrompt,
      "llama-3.3-70b-versatile"
    );

    // Additional cleaning for chat responses
    const cleanResponse = response
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/\*\s/g, '- ')
      .replace(/^\s*[\*\+]\s*/gm, '- ')
      .replace(/(\*\*|__)/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    return new Response(
      JSON.stringify({ response: cleanResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'I apologize, but I encountered an issue processing your request. Please try again or contact support if the problem persists.',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
