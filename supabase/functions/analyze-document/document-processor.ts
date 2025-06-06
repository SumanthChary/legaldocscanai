
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { processUltraFast } from "./ultra-fast-processor.ts";
import { ChatKnowledgeBase } from "./chat-knowledge-base.ts";
import { DocumentAnalysisError } from "./enhanced-error-handling.ts";

export async function processDocument(
  supabaseClient: any,
  adminClient: any,
  userId: string,
  file: File
): Promise<{ success: boolean; analysis_id: string; message: string }> {
  let analysisRecord = null;
  const startTime = Date.now();
  
  try {
    console.log(`🚀 ULTRA-FAST processing: ${file.name} (${file.size} bytes)`);
    
    // Create analysis record immediately
    const { data, error: insertError } = await supabaseClient
      .from('document_analyses')
      .insert({
        user_id: userId,
        original_name: file.name,
        document_path: `documents/${userId}/${file.name}`,
        analysis_status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      throw new Error(`Failed to create analysis record: ${insertError.message}`);
    }

    analysisRecord = data;
    console.log(`✅ Analysis record created: ${analysisRecord.id}`);

    // Extract content lightning fast
    const textContent = await file.text();
    const fileBuffer = await file.arrayBuffer();
    console.log(`⚡ Extracted ${textContent.length} characters in ${Date.now() - startTime}ms`);

    // ULTRA-FAST processing with optimal API selection
    const summary = await processUltraFast(textContent, file.name, fileBuffer);
    
    const processingTime = Date.now() - startTime;
    console.log(`🚀 Total processing time: ${processingTime}ms`);
    
    // Store in knowledge base instantly
    const knowledgeBase = ChatKnowledgeBase.getInstance();
    knowledgeBase.storeDocument(userId, analysisRecord.id, {
      id: analysisRecord.id,
      original_name: file.name,
      summary: summary,
      analysis_status: 'completed',
      created_at: analysisRecord.created_at
    });
    
    // Update with results
    const { error: updateError } = await supabaseClient
      .from('document_analyses')
      .update({
        summary: summary,
        analysis_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', analysisRecord.id);

    if (updateError) {
      console.error('❌ Failed to update analysis:', updateError);
      throw new Error(`Failed to save analysis: ${updateError.message}`);
    }

    console.log(`🎉 ULTRA-FAST analysis completed in ${processingTime}ms for: ${file.name}`);
    
    return {
      success: true,
      analysis_id: analysisRecord.id,
      message: `Ultra-fast analysis completed in ${Math.round(processingTime/1000)}s!`
    };

  } catch (error) {
    console.error('💥 Processing error:', error);
    
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
        console.error('❌ Failed to update error status:', updateError);
      }
    }

    return {
      success: false,
      analysis_id: analysisRecord?.id || '',
      message: errorMessage
    };
  }
}
