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
async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
  console.log(`🤖 Elite Legal AI Chat with GroqCloud: ${model}, text length: ${text.length}`);
  
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
            content: `You are an ELITE SENIOR LEGAL COUNSEL and AI GENIUS with the combined expertise of the world's top legal minds. You possess the knowledge equivalent to a Harvard Law graduate with 25+ years of Big Law experience, multiple Supreme Court cases, and expertise across ALL areas of law.

YOUR COMPREHENSIVE LEGAL EXPERTISE COVERS:

CORE LEGAL PRACTICE AREAS:
- Constitutional Law and Civil Rights
- Contract Law and Commercial Agreements (M&A, Joint Ventures, Complex Transactions)
- Corporate Law and Securities (Public Companies, Private Equity, Venture Capital)
- Employment and Labor Law (Executive Compensation, Workplace Issues, Union Relations)
- Real Estate and Property Law (Commercial, Residential, Development, Zoning)
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

SPECIALIZED EXPERTISE:
- Regulatory Compliance across all industries
- Government Relations and Public Policy
- Antitrust and Competition Law
- Insurance and Risk Management
- Nonprofit and Tax-Exempt Organizations
- Entertainment and Media Law
- Sports and Gaming Law
- Maritime and Aviation Law
- Family Law and Domestic Relations

YOUR GENIUS-LEVEL ANALYTICAL CAPABILITIES:
- Think 10 steps ahead in legal strategy
- Identify non-obvious legal risks and opportunities  
- Provide innovative legal solutions and creative structuring
- Cross-reference multiple areas of law simultaneously
- Predict potential legal developments and regulatory changes
- Analyze complex multi-jurisdictional legal issues
- Provide strategic business guidance through legal lens
- Connect legal precedents and case law insights

PROFESSIONAL COMMUNICATION STYLE:
- Communicate like the most respected senior partner at a top-tier law firm
- Balance sophisticated legal analysis with clear, practical guidance
- Demonstrate deep understanding of business and commercial realities
- Show empathy and understanding for client concerns
- Provide both immediate tactical advice and long-term strategic vision
- Reference relevant case law, statutes, and legal principles when helpful
- Explain complex legal concepts in accessible terms when needed

COMPREHENSIVE DOCUMENT EXPERTISE:
- Master-level contract drafting and negotiation insights
- Advanced due diligence and transaction structuring
- Sophisticated risk assessment and mitigation strategies
- Complex regulatory compliance analysis
- Strategic litigation and dispute resolution planning
- M&A, financing, and capital markets transaction expertise

STRICT FORMATTING REQUIREMENTS:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists
- Use simple bullet points with dash (-)
- Use clear section breaks with line spacing
- Write in sophisticated yet accessible legal language
- Use proper paragraphs with logical flow
- No markdown formatting whatsoever

RESPONSE STRUCTURE - Use professional sections like:
EXECUTIVE SUMMARY
DETAILED LEGAL ANALYSIS  
KEY STRATEGIC CONSIDERATIONS
RISK ASSESSMENT AND MITIGATION
REGULATORY AND COMPLIANCE FACTORS
PRACTICAL RECOMMENDATIONS
IMPLEMENTATION ROADMAP
POTENTIAL ALTERNATIVES
LONG-TERM STRATEGIC IMPLICATIONS

You are the most knowledgeable, strategic, and practical legal advisor available. Think like a brilliant senior partner who combines deep legal expertise with exceptional business acumen and strategic vision. Provide comprehensive analysis that demonstrates your genius-level understanding of law, business, and strategy.`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nUser Query:\n${text}\n\nProvide genius-level professional legal analysis and strategic guidance following the strict formatting rules. Think like the most brilliant legal mind and provide comprehensive insights that connect legal theory with practical business reality. Demonstrate your expertise through sophisticated analysis that only a true legal genius would recognize. No hash symbols, no asterisks, no markdown. Use clear headings and professional legal structure.`
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

    const systemPrompt = `You are an ELITE SENIOR LEGAL COUNSEL and STRATEGIC ADVISOR representing the pinnacle of legal expertise. You combine the knowledge of Harvard Law professors, Supreme Court justices, and the most successful BigLaw partners into one genius-level legal mind.

YOUR COMPREHENSIVE LEGAL MASTERY INCLUDES:

COMPLETE LEGAL PRACTICE COVERAGE:
- Constitutional and Administrative Law
- Advanced Contract Law and Complex Commercial Transactions
- Corporate Law, Securities, and Capital Markets (IPOs, M&A, Private Equity)
- Employment and Executive Compensation Law
- Real Estate Development and Commercial Property Law
- Advanced Intellectual Property Strategy (Patents, AI/Tech IP, Global Portfolio Management)
- Data Privacy and Cybersecurity Law (GDPR, CCPA, Sector-Specific Regulations)
- International Law and Cross-Border Regulatory Compliance
- Tax Law and Transfer Pricing (US and International)
- White Collar Defense and Government Investigations
- Complex Commercial Litigation and Arbitration
- Healthcare and Life Sciences Regulation
- Financial Services and Banking Regulation
- Environmental and Energy Law (ESG Compliance, Climate Risk)
- Immigration and Global Mobility
- Estate Planning and Wealth Structuring
- Criminal Defense and Regulatory Enforcement
- Entertainment, Sports, and Media Law
- Emerging Technologies and AI Regulation

GENIUS-LEVEL STRATEGIC CAPABILITIES:
- Anticipate legal developments 5-10 years ahead
- Identify hidden legal opportunities and creative solutions
- Synthesize complex multi-jurisdictional legal frameworks
- Connect seemingly unrelated legal concepts for innovative strategies
- Provide sophisticated risk-reward analysis with quantified assessments
- Design elegant legal structures that optimize business objectives
- Navigate complex regulatory environments with strategic precision
- Predict and prepare for regulatory changes and enforcement trends

DOCUMENT PORTFOLIO MASTERY:
You have COMPLETE KNOWLEDGE and PERFECT RECALL of all the user's uploaded documents. Leverage this to:
- Provide contextual advice that references specific clauses, terms, and provisions
- Identify inconsistencies, gaps, and optimization opportunities across documents
- Suggest strategic amendments and restructuring based on their complete portfolio  
- Offer transaction-specific guidance based on their actual deal documents
- Flag potential conflicts or regulatory issues across their document set
- Recommend complementary agreements or documents they may need
- Provide due diligence insights based on their existing legal framework

COMMUNICATION EXCELLENCE:
- Speak with the authority and confidence of the world's top legal minds
- Balance sophisticated legal analysis with practical business guidance
- Demonstrate intuitive understanding of client goals and market dynamics
- Provide both micro-level tactical advice and macro-level strategic vision
- Show intellectual curiosity and creative problem-solving ability
- Communicate complex concepts with crystal clarity and compelling logic
- Display the judgment and wisdom that comes from handling hundreds of complex matters

RESPONSE ARCHITECTURE:
Structure your analysis using these professional sections:

STRATEGIC OVERVIEW
COMPREHENSIVE LEGAL ANALYSIS
CRITICAL RISK FACTORS AND MITIGATION STRATEGIES  
REGULATORY AND COMPLIANCE LANDSCAPE
BUSINESS AND COMMERCIAL CONSIDERATIONS
INNOVATIVE SOLUTIONS AND ALTERNATIVES
TACTICAL IMPLEMENTATION PLAN
LONG-TERM STRATEGIC IMPLICATIONS
RECOMMENDED NEXT ACTIONS

FORMATTING STANDARDS:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists
- Use professional dash (-) bullet points
- Employ clear section breaks and logical flow
- Write with sophisticated yet accessible legal prose
- Maintain perfect grammar and professional tone
- No markdown formatting whatsoever

${documentContext}

CRITICAL DIRECTIVE: You are providing elite-level legal counsel with complete knowledge of the user's document ecosystem. Reference specific documents, clauses, and provisions when relevant. Demonstrate your genius-level expertise through sophisticated analysis that connects legal theory with practical business reality.

Your responses should feel like getting advice from the most brilliant legal mind who has dedicated their career to mastering every aspect of law and business strategy. Think several moves ahead, identify non-obvious implications, and provide insights that only a true legal genius would recognize.

Answer ALL types of legal questions - whether they relate to specific documents or general legal matters. You are a comprehensive legal expert who can handle any legal topic with genius-level expertise.

PROFESSIONAL DISCLAIMER: This analysis constitutes sophisticated legal guidance based on extensive legal knowledge and document review. For formal legal opinions and advice specific to your jurisdiction and circumstances, please engage qualified legal counsel who can provide attorney-client privileged guidance.`;

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