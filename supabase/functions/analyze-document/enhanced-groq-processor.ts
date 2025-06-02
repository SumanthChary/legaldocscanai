
import { extractAndValidateText } from "./text-processing.ts";
import { smartChunking } from "./text-chunking.ts";
import { callGroqCloudAPI, analyzeWithVision, getBestModel } from "./groqcloud-client.ts";
import { getDocumentContext } from "./gemini-client.ts";
import { getDetailedPrompt, getLegalPrompt, getBusinessPrompt } from "./prompt-templates.ts";

/**
 * Enhanced processor using GroqCloud's advanced AI models
 */
export async function processWithGroqCloud(text: string, fileName: string, fileBuffer?: ArrayBuffer): Promise<string> {
  console.log(`Starting GroqCloud analysis for: ${fileName}`);
  
  try {
    // Extract and validate text
    const cleanedText = extractAndValidateText(text, fileName);
    console.log(`Text processed: ${cleanedText.length} characters`);
    
    // Determine document context
    const documentContext = getDocumentContext(cleanedText, fileName);
    console.log(`Document type: ${documentContext.type}`);
    
    // Check if document has images (for vision analysis)
    const hasImages = fileBuffer && (fileName.toLowerCase().includes('.pdf') || fileName.toLowerCase().includes('.png') || fileName.toLowerCase().includes('.jpg'));
    
    // Get the best model for this document type
    const model = getBestModel(documentContext.type, hasImages);
    console.log(`Using model: ${model}`);
    
    // If we have images and it's a PDF, try vision analysis first
    if (hasImages && fileBuffer) {
      try {
        const base64Data = `data:application/pdf;base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
        const visionResult = await analyzeWithVision(base64Data, cleanedText);
        return formatProfessionalSummary(visionResult, fileName, documentContext.type, "Enhanced Vision Analysis");
      } catch (visionError) {
        console.log("Vision analysis failed, falling back to text analysis:", visionError);
      }
    }
    
    // Smart chunking for large documents
    const chunks = smartChunking(cleanedText);
    console.log(`Document split into ${chunks.length} chunks`);
    
    let finalSummary: string;
    
    if (chunks.length === 1) {
      // Single chunk analysis with best model
      finalSummary = await processSingleChunkGroq(chunks[0], documentContext, fileName, model);
    } else {
      // Multi-chunk analysis
      finalSummary = await processMultipleChunksGroq(chunks, documentContext, fileName, model);
    }
    
    return formatProfessionalSummary(finalSummary, fileName, documentContext.type, "Advanced AI Analysis");
    
  } catch (error) {
    console.error("GroqCloud processing error:", error);
    throw error;
  }
}

async function processSingleChunkGroq(
  chunk: string, 
  context: { type: string, approach: string }, 
  fileName: string, 
  model: string
): Promise<string> {
  
  // Get specialized prompt based on document type
  let prompt = getDetailedPrompt("complete");
  if (context.type === 'legal') {
    prompt = getLegalPrompt();
  } else if (context.type === 'business') {
    prompt = getBusinessPrompt();
  }
  
  // Clean the prompt of formatting symbols
  prompt = prompt.replace(/#{1,6}\s*/g, '').replace(/\*{1,2}/g, '');
  
  return await callGroqCloudAPI(chunk, prompt, model);
}

async function processMultipleChunksGroq(
  chunks: string[], 
  context: { type: string, approach: string }, 
  fileName: string, 
  model: string
): Promise<string> {
  
  const chunkSummaries = [];
  
  // Process each chunk
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}`);
    
    let prompt = getDetailedPrompt("chunk", i + 1, chunks.length);
    prompt = prompt.replace(/#{1,6}\s*/g, '').replace(/\*{1,2}/g, '');
    
    const chunkSummary = await callGroqCloudAPI(chunks[i], prompt, model);
    chunkSummaries.push(`SECTION ${i + 1}: ${chunkSummary}`);
  }
  
  // Combine all chunks
  const combinedText = chunkSummaries.join("\n\n---\n\n");
  let combinePrompt = getDetailedPrompt("combine");
  combinePrompt = combinePrompt.replace(/#{1,6}\s*/g, '').replace(/\*{1,2}/g, '');
  
  return await callGroqCloudAPI(combinedText, combinePrompt, model);
}

function formatProfessionalSummary(summary: string, fileName: string, documentType: string, analysisType: string): string {
  const timestamp = new Date().toLocaleDateString();
  
  // Ensure the summary is clean of unwanted symbols
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

Analysis Complete | Powered by LegalBriefAI Advanced AI | ${timestamp}`;
  
  return header + cleanSummary + footer;
}
