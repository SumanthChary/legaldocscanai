
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { callGroqCloudAPI } from "../analyze-document/groqcloud-client.ts";

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
