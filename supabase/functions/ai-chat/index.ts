
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { callGroqCloudAPI } from "../analyze-document/groqcloud-client.ts";
import { ChatKnowledgeBase } from "../analyze-document/chat-knowledge-base.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get user's recent documents for context
    const knowledgeBase = ChatKnowledgeBase.getInstance();
    const userDocuments = knowledgeBase.getUserDocuments(userId);
    const relevantDocs = knowledgeBase.searchDocuments(userId, message);

    // Build context from user's documents
    let documentContext = "";
    if (relevantDocs.length > 0) {
      documentContext = `\n\nUser's Recent Documents Context:\n`;
      relevantDocs.slice(0, 3).forEach((doc, index) => {
        documentContext += `${index + 1}. Document: ${doc.original_name}\n`;
        documentContext += `   Summary: ${doc.summary.substring(0, 500)}...\n\n`;
      });
    }

    // Get legal knowledge if needed
    const legalKnowledge = knowledgeBase.getLegalKnowledge(message);

    const systemPrompt = `You are a professional legal AI assistant with expertise in legal document analysis and law. You have access to the user's recently analyzed documents and can provide detailed insights about them.

Your capabilities include:
- Analyzing legal documents and contracts
- Explaining legal concepts and terms
- Providing insights about compliance and risk factors
- Answering questions about recently uploaded documents
- Offering strategic legal advice (while noting this is not formal legal counsel)

Always provide professional, clear responses without using symbols like hash, asterisk, or markdown formatting. Use proper paragraph structure and bullet points with simple text formatting.

Legal Knowledge Base: ${legalKnowledge}
${documentContext}

Remember to be helpful, professional, and accurate. If referencing specific documents, mention them by name.`;

    const response = await callGroqCloudAPI(
      message,
      systemPrompt,
      "llama-3.3-70b-versatile"
    );

    // Clean response of any unwanted formatting
    const cleanResponse = response
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/^\s*[\*\-\+]\s*/gm, '• ')
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
