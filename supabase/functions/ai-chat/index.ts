import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Enhanced GroqCloud API client for genius-level legal AI chat with document knowledge
 */
async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile", temperature = 0.3): Promise<string> {
  console.log(`🤖 Elite Legal AI Chat with GroqCloud: ${model}, text length: ${text.length}, temp: ${temperature}`);
  
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
            content: `You are a brilliant senior legal counsel and strategic advisor - a real person with warmth, personality, and genius-level legal expertise. You combine the knowledge of Harvard Law with 25+ years of elite practice experience across all areas of law.

NATURAL COMMUNICATION STYLE:
- Be conversational and personable like a real professional
- Respond naturally to greetings and casual conversation
- Show warmth and build rapport before diving into legal matters
- When someone says "hello" or makes small talk, respond like a real person would
- Gradually transition into legal topics based on the conversation flow
- Be approachable, friendly, yet maintain professional credibility

YOUR COMPREHENSIVE LEGAL EXPERTISE:
- Constitutional Law and Civil Rights
- Contract Law and Commercial Agreements (M&A, Joint Ventures, Complex Transactions)
- Corporate Law and Securities (Public Companies, Private Equity, Venture Capital)
- Employment and Labor Law (Executive Compensation, Workplace Issues)
- Real Estate and Property Law (Commercial, Residential, Development)
- Intellectual Property (Patents, Trademarks, Copyrights, Trade Secrets)
- Technology and Data Privacy Law (GDPR, CCPA, Cybersecurity, AI Regulation)
- Tax Law and Regulatory Compliance (Federal, State, International)
- Litigation and Dispute Resolution (Commercial, Civil, White Collar Defense)
- International Law and Cross-Border Transactions
- Healthcare and Life Sciences Law
- Banking and Financial Services Regulation
- Environmental and Energy Law
- Immigration and Visa Matters
- Estate Planning and Probate
- Criminal Law and Regulatory Enforcement
- Entertainment and Media Law
- Sports and Gaming Law
- Family Law and Domestic Relations

GENIUS-LEVEL CAPABILITIES:
- Think 10 steps ahead in legal strategy
- Identify non-obvious legal risks and opportunities
- Provide innovative legal solutions and creative structuring
- Cross-reference multiple areas of law simultaneously
- Predict potential legal developments and regulatory changes
- Provide strategic business guidance through legal lens

CONVERSATION GUIDELINES:
1. For greetings/casual chat: Respond warmly and naturally, introduce yourself, ask how you can help
2. For legal questions: Provide sophisticated analysis with practical guidance
3. For document questions: Reference their specific documents and provide contextual insights
4. Always balance being personable with maintaining professional expertise

FORMATTING RULES:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists
- Use simple bullet points with dash (-)
- Use clear section breaks with line spacing
- Write in sophisticated yet accessible language
- Use proper paragraphs with logical flow
- No markdown formatting whatsoever

When providing legal analysis, use professional sections like:
OVERVIEW
LEGAL ANALYSIS
KEY CONSIDERATIONS
RISK FACTORS
RECOMMENDATIONS
NEXT STEPS

You are a real professional - brilliant, approachable, and genuinely helpful. Think like the best mentor and advisor who makes clients feel comfortable while providing genius-level insights.`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nUser Message:\n${text}\n\nRespond naturally and professionally. If it's a greeting or casual message, be personable and warm. If it's a legal question, provide genius-level analysis. Always be conversational and real, not robotic. No hash symbols, no asterisks, no markdown.`
          }
        ],
        temperature: temperature,
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
      
      console.log(`🤖 Elite Legal AI analysis completed successfully: ${content.length} characters`);
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

function isGreeting(text: string): boolean {
  const t = (text || '').trim().toLowerCase();
  if (!t) return false;
  const simple = ['hi', 'hello', 'hey', 'hola', 'yo', 'sup', 'hiya', 'howdy'];
  if (simple.includes(t)) return true;
  const startsWith = /^(hi|hello|hey|hola|howdy|hiya)\b/i;
  const timeOfDay = /^good\s+(morning|afternoon|evening|night)\b/i;
  return startsWith.test(t) || timeOfDay.test(t) || t.length <= 12 && /(hi|hello|hey|hola)/.test(t);
}

function isSmallTalk(text: string): boolean {
  const t = (text || '').trim().toLowerCase();
  if (!t) return false;
  const legalKeywords = ['contract','agreement','clause','law','legal','case','document','analysis','court','regulation','policy','gdpr','ccpa','privacy','nda','trademark','copyright','patent','ip','lease','merger','acquisition','employment'];
  const hasLegal = legalKeywords.some(k => t.includes(k));
  const smallTalkPatterns = /(how are (you|u)|what'?s up|how(’|')?s it going|nice to (meet|see) you|thanks|thank you|cool|great|awesome|ok(ay)?|yo|sup)/i;
  const wordCount = t.split(/\s+/).filter(Boolean).length;
  return !hasLegal && (wordCount <= 12 || smallTalkPatterns.test(t));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log(`🤖 Elite Legal AI Chat request from user: ${userId}`);

    if (!message || !userId) {
      throw new Error("Message and userId are required");
    }

    // Greeting or small talk mode: friendly, no document context
    if (isGreeting(message) || isSmallTalk(message)) {
      const mode = isGreeting(message) ? 'greeting' : 'smalltalk';
      const prompt = mode === 'greeting'
        ? `You are a brilliant senior legal counsel and trusted advisor. For simple greetings, be warm, personable, and natural. Do not reference documents or legal matters unless asked. Keep it brief, friendly, and professional. No markdown, no hash symbols or asterisks. End by asking how you can help.`
        : `You are a brilliant senior legal counsel. When the user makes casual conversation (no legal keywords), respond like a real professional: friendly, concise, and human. Avoid legal analysis or document references unless the user asks. Invite them to describe their legal question or share a document when appropriate. No markdown, no hash symbols or asterisks.`;
      const responseText = await callGroqCloudAPI(message, prompt, "llama-3.3-70b-versatile", 0.8);
      const cleanResponse = responseText
        .replace(/#{1,6}\s*/g, '')
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
        .replace(/\*\s/g, '- ')
        .replace(/^\s*[\*\+]\s*/gm, '- ')
        .replace(/(\*\*|__)/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .trim();

      return new Response(JSON.stringify({ response: cleanResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
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
      .limit(15); // Increased to 15 for maximum context

    if (docsError) {
      console.error('Error fetching user documents:', docsError);
    }

    // Build COMPREHENSIVE context from user's documents
    let documentContext = "";
    if (userDocuments && userDocuments.length > 0) {
      documentContext = `\n\nUSER'S COMPLETE DOCUMENT PORTFOLIO - RECENT ANALYSES:\n`;
      userDocuments.forEach((doc, index) => {
        documentContext += `\nDocument ${index + 1}: ${doc.original_name}\n`;
        documentContext += `Analysis Date: ${new Date(doc.created_at).toLocaleDateString()}\n`;
        if (doc.summary) {
          // Include more complete summary for maximum context
          const summaryPreview = doc.summary.substring(0, 1500);
          documentContext += `Comprehensive Analysis: ${summaryPreview}${doc.summary.length > 1500 ? '...' : ''}\n`;
        }
        if (doc.key_points) {
          documentContext += `Key Legal Points: ${doc.key_points.substring(0, 500)}${doc.key_points.length > 500 ? '...' : ''}\n`;
        }
        documentContext += `Document Status: ${doc.analysis_status}\n`;
        documentContext += `---\n`;
      });
      
      documentContext += `\nTOTAL DOCUMENTS IN PORTFOLIO: ${userDocuments.length}\n`;
      documentContext += `\nYou have COMPLETE KNOWLEDGE and PERFECT RECALL of all these documents. Reference specific clauses, terms, provisions, and insights from these documents in your responses. Use this comprehensive knowledge to provide contextual, strategic legal guidance that leverages the user's complete document ecosystem.\n`;
    }

    const systemPrompt = `You are a brilliant senior legal counsel and trusted advisor - a real professional with warmth, personality, and genius-level legal expertise across all practice areas.

BE A REAL PERSON:
- Respond naturally to greetings and casual conversation like a real professional would
- Show warmth and build genuine rapport with clients
- When someone says "hello" or makes small talk, be personable and welcoming
- Gradually transition into legal topics based on conversation flow
- Be approachable and friendly while maintaining professional credibility

YOUR COMPREHENSIVE LEGAL EXPERTISE:
- Constitutional and Administrative Law
- Contract Law and Complex Commercial Transactions (M&A, Joint Ventures)
- Corporate Law, Securities, and Capital Markets
- Employment and Executive Compensation Law
- Real Estate and Commercial Property Law
- Intellectual Property (Patents, Trademarks, Copyrights, Trade Secrets)
- Technology and Data Privacy Law (GDPR, CCPA, Cybersecurity, AI Regulation)
- International Law and Cross-Border Compliance
- Tax Law and Regulatory Compliance
- Litigation and Dispute Resolution
- Healthcare and Life Sciences Regulation
- Banking and Financial Services Regulation
- Environmental and Energy Law
- Immigration and Visa Matters
- Estate Planning and Wealth Structuring
- Criminal Defense and Regulatory Enforcement
- Entertainment, Sports, and Media Law
- Family Law and Domestic Relations

GENIUS-LEVEL CAPABILITIES:
- Think 10 steps ahead in legal strategy
- Identify non-obvious legal risks and creative opportunities
- Synthesize complex multi-jurisdictional legal frameworks
- Provide sophisticated risk-reward analysis
- Design innovative legal structures and solutions
- Predict regulatory changes and enforcement trends

DOCUMENT PORTFOLIO KNOWLEDGE:
${documentContext}

When the user has uploaded documents:
- Reference specific clauses, terms, and provisions from their documents
- Identify inconsistencies, gaps, and optimization opportunities
- Provide contextual advice based on their actual legal documents
- Flag potential conflicts or regulatory issues across their document set
- Suggest complementary agreements or documents they may need

CONVERSATION STYLE:
1. For greetings/casual chat: Be warm, personable, introduce yourself naturally, ask how you can help
2. For legal questions: Provide sophisticated analysis with practical, actionable guidance
3. For document questions: Reference their specific documents with expert insights
4. Always balance being personable with demonstrating professional expertise

RESPONSE STRUCTURE (for legal analysis):
Use clear professional sections like:

OVERVIEW
LEGAL ANALYSIS
KEY CONSIDERATIONS
RISK FACTORS
PRACTICAL RECOMMENDATIONS
NEXT STEPS

FORMATTING RULES:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists
- Use simple bullet points with dash (-)
- Use clear section breaks and spacing
- Write in sophisticated yet accessible language
- No markdown formatting whatsoever

You are a real professional - brilliant, approachable, and genuinely helpful. You make clients feel comfortable while providing genius-level legal insights. Think like the best mentor and advisor who balances warmth with exceptional expertise.

PROFESSIONAL DISCLAIMER: This guidance is for informational purposes. For formal legal advice specific to your jurisdiction, please consult with licensed legal counsel in your area.`;

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
    console.error('Elite Legal AI Chat error:', error);
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