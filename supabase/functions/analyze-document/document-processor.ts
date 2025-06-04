
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { processWithGroqCloud } from "./enhanced-groq-processor.ts";
import { ChatKnowledgeBase } from "./chat-knowledge-base.ts";
import { DocumentAnalysisError } from "./enhanced-error-handling.ts";

export async function processDocument(
  supabaseClient: any,
  adminClient: any,
  userId: string,
  file: File
): Promise<{ success: boolean; analysis_id: string; message: string }> {
  let analysisRecord = null;
  
  try {
    console.log(`📄 Processing document: ${file.name} (${file.size} bytes)`);
    
    // Create initial analysis record without file_size
    const { data, error: insertError } = await supabaseClient
      .from('document_analyses')
      .insert({
        user_id: userId,
        original_name: file.name,
        document_path: `documents/${userId}/${file.name}`,
        analysis_status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to create analysis record: ${insertError.message}`);
    }

    analysisRecord = data;
    console.log(`✅ Analysis record created with ID: ${analysisRecord.id}`);

    // Extract text content and file buffer for vision analysis
    const textContent = await file.text();
    const fileBuffer = await file.arrayBuffer();
    console.log(`📝 Extracted ${textContent.length} characters from file`);

    // Use GroqCloud for enhanced analysis
    const summary = await processWithGroqCloud(textContent, file.name, fileBuffer);
    
    // Store in knowledge base for chat
    const knowledgeBase = ChatKnowledgeBase.getInstance();
    knowledgeBase.storeDocument(userId, analysisRecord.id, {
      id: analysisRecord.id,
      original_name: file.name,
      summary: summary,
      analysis_status: 'completed',
      created_at: analysisRecord.created_at
    });
    
    // Update with successful results
    const { error: updateError } = await supabaseClient
      .from('document_analyses')
      .update({
        summary: summary,
        analysis_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', analysisRecord.id);

    if (updateError) {
      console.error('Failed to update analysis:', updateError);
      throw new Error(`Failed to save analysis: ${updateError.message}`);
    }

    console.log(`🎉 GroqCloud analysis completed successfully for document: ${file.name}`);
    
    return {
      success: true,
      analysis_id: analysisRecord.id,
      message: 'Document analysis completed successfully with advanced AI'
    };

  } catch (error) {
    console.error('💥 Document processing error:', error);
    
    let errorMessage = 'Document analysis failed';
    let analysisStatus = 'failed';
    
    if (error instanceof DocumentAnalysisError) {
      errorMessage = error.userMessage;
      if (error.recoverable) {
        analysisStatus = 'failed_recoverable';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (analysisRecord) {
      try {
        await supabaseClient
          .from('document_analyses')
          .update({
            analysis_status: analysisStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', analysisRecord.id);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }

    return {
      success: false,
      analysis_id: analysisRecord?.id || '',
      message: errorMessage
    };
  }
}
