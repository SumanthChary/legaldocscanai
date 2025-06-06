
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Enhanced GroqCloud API client for legal AI chat with document knowledge
 */
async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
  console.log(`🤖 Legal AI Chat with GroqCloud: ${model}, text length: ${text.length}`);
  
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
            content: `You are an EXPERT LEGAL AI ASSISTANT with comprehensive knowledge of law, legal documents, and professional legal practice. You think and respond like an actual experienced lawyer with deep expertise in:

LEGAL EXPERTISE AREAS:
- Contract Law and Agreement Analysis
- Corporate Law and Business Documents
- Employment Law and HR Policies
- Real Estate and Property Law
- Intellectual Property Law
- Regulatory Compliance
- Litigation and Dispute Resolution
- Legal Risk Assessment
- Document Review and Analysis

PROFESSIONAL RESPONSE STYLE:
- Think like an actual practicing lawyer
- Provide detailed legal insights and analysis
- Identify potential legal risks and issues
- Offer practical legal recommendations
- Reference relevant legal principles and concepts
- Use professional legal terminology appropriately
- Provide actionable legal guidance

DOCUMENT ANALYSIS CAPABILITIES:
- Comprehensive contract review and analysis
- Legal document summarization
- Risk factor identification
- Compliance assessment
- Due diligence support
- Legal strategy recommendations

STRICT FORMATTING RULES:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists
- Use simple bullet points with dash (-)
- Use clear section breaks with line spacing
- Write in professional legal language
- Use proper paragraphs and sentence structure
- No markdown formatting whatsoever

RESPONSE STRUCTURE:
Use clear professional sections like:
LEGAL ANALYSIS
KEY LEGAL ISSUES
RISK ASSESSMENT
COMPLIANCE CONSIDERATIONS
RECOMMENDATIONS
NEXT STEPS

Provide comprehensive, detailed legal analysis while maintaining professional legal standards. Always think from the perspective of an experienced practicing attorney.`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nUser Query:\n${text}\n\nProvide detailed professional legal analysis and guidance following the strict formatting rules. Think like an experienced lawyer and provide comprehensive legal insights. No hash symbols, no asterisks, no markdown. Use clear headings and professional legal structure.`
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
      
      console.log(`🤖 Legal AI analysis completed successfully: ${content.length} characters`);
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
    console.log(`🤖 Legal AI Chat request from user: ${userId}`);

    if (!message || !userId) {
      throw new Error("Message and userId are required");
    }

    // Initialize Supabase client to get user's documents
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's recent documents for COMPREHENSIVE context
    const { data: userDocuments, error: docsError } = await supabase
      .from('document_analyses')
      .select('*')
      .eq('user_id', userId)
      .eq('analysis_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10); // Increased to 10 for better context

    if (docsError) {
      console.error('Error fetching user documents:', docsError);
    }

    // Build COMPREHENSIVE context from user's documents
    let documentContext = "";
    if (userDocuments && userDocuments.length > 0) {
      documentContext = `\n\nUSER'S DOCUMENT PORTFOLIO - RECENT ANALYSES:\n`;
      userDocuments.forEach((doc, index) => {
        documentContext += `\nDocument ${index + 1}: ${doc.original_name}\n`;
        documentContext += `Analysis Date: ${new Date(doc.created_at).toLocaleDateString()}\n`;
        if (doc.summary) {
          // Include more complete summary for better context
          const summaryPreview = doc.summary.substring(0, 1200);
          documentContext += `Analysis Summary: ${summaryPreview}${doc.summary.length > 1200 ? '...' : ''}\n`;
        }
        documentContext += `Status: ${doc.analysis_status}\n`;
        documentContext += `---\n`;
      });
      
      documentContext += `\nTOTAL DOCUMENTS ANALYZED: ${userDocuments.length}\n`;
      documentContext += `\nYou have complete knowledge of all these documents and can reference them in your responses. Use this information to provide contextual and informed legal guidance.\n`;
    }

    const systemPrompt = `You are an ELITE LEGAL AI ASSISTANT with expertise comparable to a senior partner at a top law firm. You have deep knowledge of legal practice, document analysis, and comprehensive understanding of law across multiple jurisdictions.

YOUR LEGAL EXPERTISE INCLUDES:
- Contract Law and Commercial Agreements
- Corporate Law and Business Formation
- Employment Law and HR Compliance
- Real Estate and Property Transactions
- Intellectual Property and Technology Law
- Regulatory Compliance and Government Relations
- Litigation Strategy and Dispute Resolution
- Mergers & Acquisitions
- Securities Law and Finance
- International Business Law
- Risk Management and Legal Strategy

DOCUMENT ANALYSIS CAPABILITIES:
You have COMPLETE KNOWLEDGE and ACCESS to all of the user's recently uploaded and analyzed documents. Use this knowledge to:
- Provide contextual legal advice based on their specific documents
- Cross-reference information between documents
- Identify patterns, risks, and opportunities across their document portfolio
- Offer strategic legal recommendations based on their complete document set
- Answer specific questions about any of their uploaded documents

PROFESSIONAL RESPONSE STANDARDS:
- Think and respond like an experienced practicing attorney
- Provide detailed, actionable legal insights
- Identify potential legal risks, opportunities, and strategic considerations
- Offer practical legal recommendations and next steps
- Use professional legal terminology and concepts appropriately
- Maintain strict confidentiality and professional ethics

FORMATTING REQUIREMENTS:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists  
- Use simple bullet points with dash (-)
- Use clear section breaks with line spacing
- Write in professional legal language
- No markdown formatting whatsoever

RESPONSE STRUCTURE - Use clear sections like:
LEGAL ANALYSIS
KEY ISSUES AND CONSIDERATIONS
RISK ASSESSMENT
STRATEGIC RECOMMENDATIONS
IMMEDIATE ACTION ITEMS
LONG-TERM CONSIDERATIONS

${documentContext}

Remember: You are providing professional legal guidance with full knowledge of the user's document portfolio. Reference specific documents when relevant and provide comprehensive, strategic legal advice.

IMPORTANT DISCLAIMER: While providing detailed legal analysis and guidance, always note that this constitutes general legal information and users should consult with qualified legal counsel for specific legal advice tailored to their particular circumstances.`;

    const response = await callGroqCloudAPI(
      message,
      systemPrompt,
      "llama-3.3-70b-versatile"
    );

    // Additional cleaning for legal chat responses
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
    console.error('Legal AI Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'I apologize, but I encountered an issue processing your legal query. Please try again or contact support if the problem persists.',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
