
import { extractAndValidateText } from "./text-processing.ts";
import { smartChunking } from "./text-chunking.ts";
import { callGroqCloudAPI, analyzeWithVision, getBestModel } from "./groqcloud-client.ts";
import { getDocumentContext } from "./gemini-client.ts";
import { getDetailedPrompt, getLegalPrompt, getBusinessPrompt } from "./prompt-templates.ts";

/**
 * Ultra-fast processor using GroqCloud's lightning-fast models
 */
export async function processWithGroqCloud(text: string, fileName: string, fileBuffer?: ArrayBuffer): Promise<string> {
  console.log(`🚀 FAST GroqCloud analysis for: ${fileName}`);
  
  try {
    // Super fast text extraction
    const cleanedText = extractAndValidateText(text, fileName);
    console.log(`⚡ Text processed: ${cleanedText.length} characters`);
    
    // Quick document context analysis
    const documentContext = getDocumentContext(cleanedText, fileName);
    console.log(`📊 Document type: ${documentContext.type}`);
    
    // Check file type for optimal processing
    const fileExtension = fileName.toLowerCase().split('.').pop() || '';
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    // Use vision for images and PDFs with images
    if ((isImage || isPDF) && fileBuffer) {
      try {
        console.log(`🖼️ Using vision analysis for ${fileExtension}`);
        let base64Data: string;
        
        if (isImage) {
          const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
          base64Data = `data:${mimeType};base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
        } else {
          base64Data = `data:application/pdf;base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
        }
        
        const visionResult = await analyzeWithVision(base64Data, cleanedText);
        return formatProfessionalSummary(visionResult, fileName, documentContext.type, "Lightning Vision Analysis");
      } catch (visionError) {
        console.log("⚠️ Vision failed, using text analysis:", visionError);
      }
    }
    
    // Ultra-fast text processing with best model
    const model = "llama-3.3-70b-versatile"; // Fastest high-quality model
    
    // Smart chunking for optimal speed
    const chunks = smartChunking(cleanedText, 4000); // Smaller chunks for speed
    console.log(`📑 Split into ${chunks.length} chunks for speed`);
    
    let finalSummary: string;
    
    if (chunks.length === 1) {
      // Single chunk - lightning fast
      finalSummary = await processSingleChunkGroq(chunks[0], documentContext, fileName, model);
    } else {
      // Multi-chunk with parallel processing for speed
      finalSummary = await processMultipleChunksGroq(chunks, documentContext, fileName, model);
    }
    
    return formatProfessionalSummary(finalSummary, fileName, documentContext.type, "GroqCloud Lightning Analysis");
    
  } catch (error) {
    console.error("💥 GroqCloud processing error:", error);
    throw error;
  }
}

async function processSingleChunkGroq(
  chunk: string, 
  context: { type: string, approach: string }, 
  fileName: string, 
  model: string
): Promise<string> {
  
  // Ultra-optimized prompt for speed
  let prompt = "Analyze this document quickly and comprehensively. Provide key insights, main points, and important details in a structured professional format:";
  
  if (context.type === 'legal') {
    prompt = "Quickly analyze this legal document. Extract key clauses, terms, obligations, risks, and provide professional legal insights:";
  } else if (context.type === 'business') {
    prompt = "Rapidly analyze this business document. Extract key business points, strategies, financials, and recommendations:";
  }
  
  return await callGroqCloudAPI(chunk, prompt, model);
}

async function processMultipleChunksGroq(
  chunks: string[], 
  context: { type: string, approach: string }, 
  fileName: string, 
  model: string
): Promise<string> {
  
  console.log(`⚡ Processing ${chunks.length} chunks in parallel for maximum speed`);
  
  try {
    // Process chunks in parallel for maximum speed
    const chunkPromises = chunks.map(async (chunk, i) => {
      const prompt = `Quickly analyze section ${i + 1}/${chunks.length} of this document. Extract key points and insights:`;
      const result = await callGroqCloudAPI(chunk, prompt, model);
      return `SECTION ${i + 1}: ${result}`;
    });
    
    const chunkSummaries = await Promise.all(chunkPromises);
    
    // Quick combine
    const combinedText = chunkSummaries.join("\n\n---\n\n");
    const combinePrompt = "Synthesize these document sections into one comprehensive professional analysis:";
    
    return await callGroqCloudAPI(combinedText, combinePrompt, model);
    
  } catch (error) {
    console.log("⚠️ Parallel processing failed, using sequential:");
    // Fallback to sequential processing
    const chunkSummaries = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`📄 Processing chunk ${i + 1}/${chunks.length}`);
      const prompt = `Analyze section ${i + 1}/${chunks.length}:`;
      const chunkSummary = await callGroqCloudAPI(chunks[i], prompt, model);
      chunkSummaries.push(`SECTION ${i + 1}: ${chunkSummary}`);
    }
    
    const combinedText = chunkSummaries.join("\n\n---\n\n");
    return await callGroqCloudAPI(combinedText, "Combine these sections into comprehensive analysis:", model);
  }
}

function formatProfessionalSummary(summary: string, fileName: string, documentType: string, analysisType: string): string {
  const timestamp = new Date().toLocaleDateString();
  
  // Clean the summary aggressively
  const cleanSummary = summary
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/^\s*[\*\-\+]\s*/gm, '• ')
    .trim();
  
  const header = `DOCUMENT ANALYSIS REPORT
File: ${fileName}
Analysis Date: ${timestamp}
Document Type: ${documentType.charAt(0).toUpperCase() + documentType.slice(1)}
Analysis Method: ${analysisType}

---

`;
  
  const footer = `

---

⚡ Lightning Analysis Complete | LegalBriefAI Advanced AI | ${timestamp}`;
  
  return header + cleanSummary + footer;
}
