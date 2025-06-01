import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { extractAndValidateText } from "./text-processing.ts";
import { smartChunking } from "./text-chunking.ts";
import { callGeminiAPI, getDocumentContext } from "./gemini-client.ts";
import { getDetailedPrompt, getLegalPrompt, getBusinessPrompt } from "./prompt-templates.ts";
import { processBulletproof } from "./bulletproof-processor.ts";
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
    
    // Create initial analysis record
    const { data, error: insertError } = await supabaseClient
      .from('document_analyses')
      .insert({
        user_id: userId,
        original_name: file.name,
        file_size: file.size,
        file_type: file.type,
        analysis_status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to create analysis record: ${insertError.message}`);
    }

    analysisRecord = data;
    console.log(`📝 Analysis record created with ID: ${analysisRecord.id}`);

    // Extract text content
    const textContent = await file.text();
    console.log(`📖 Extracted ${textContent.length} characters from file`);

    // Use bulletproof processor
    const summary = await processBulletproof(textContent, file.name);
    
    // Update with successful results
    const { error: updateError } = await supabaseClient
      .from('document_analyses')
      .update({
        summary: summary,
        analysis_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', analysisRecord.id);

    if (updateError) {
      console.error('Failed to update analysis:', updateError);
      throw new Error(`Failed to save analysis: ${updateError.message}`);
    }

    console.log(`✅ Analysis completed successfully for document: ${file.name}`);
    
    return {
      success: true,
      analysis_id: analysisRecord.id,
      message: 'Document analysis completed successfully'
    };

  } catch (error) {
    console.error('💥 Document processing error:', error);
    
    // Handle specific error types
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

    // Update analysis record with error
    if (analysisRecord) {
      try {
        await supabaseClient
          .from('document_analyses')
          .update({
            analysis_status: analysisStatus,
            error_message: errorMessage,
            updated_at: new Date().toISOString()
          })
          .eq('id', analysisRecord.id);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }

    // Always return success with error message for user
    return {
      success: false,
      analysis_id: analysisRecord?.id || '',
      message: errorMessage
    };
  }
}
