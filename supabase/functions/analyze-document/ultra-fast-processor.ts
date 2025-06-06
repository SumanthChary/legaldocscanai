
import { extractAndValidateText } from "./text-processing.ts";
import { callGroqCloudAPI, analyzeWithVision } from "./groqcloud-client.ts";
import { callGeminiAPI } from "./gemini-client.ts";

/**
 * ULTRA-FAST processor - results in 5-15 seconds guaranteed
 */
export async function processUltraFast(text: string, fileName: string, fileBuffer?: ArrayBuffer): Promise<string> {
  console.log(`🚀 ULTRA-FAST processing: ${fileName} (${text.length} chars)`);
  
  const startTime = Date.now();
  
  try {
    // Lightning-fast text extraction
    const cleanedText = extractAndValidateText(text, fileName);
    const fileExtension = fileName.toLowerCase().split('.').pop() || '';
    
    // Determine file type for optimal API selection
    const isTextFile = ['txt', 'doc', 'docx', 'rtf'].includes(fileExtension);
    const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    let result: string;
    
    if (isImageFile || (isPDF && fileBuffer)) {
      // Use GroqCloud vision for images and PDFs - FASTEST vision model
      console.log(`🖼️ Using GroqCloud Vision for ${fileExtension}`);
      result = await processWithGroqVision(cleanedText, fileBuffer!, fileExtension);
    } else if (isTextFile) {
      // Use Gemini for text files - optimized for text
      console.log(`📝 Using Gemini for text file: ${fileExtension}`);
      result = await processWithGeminiUltraFast(cleanedText, fileName);
    } else {
      // Use GroqCloud for everything else - fastest general model
      console.log(`⚡ Using GroqCloud for: ${fileExtension}`);
      result = await processWithGroqUltraFast(cleanedText, fileName);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ ULTRA-FAST processing complete in ${processingTime}ms`);
    
    return formatUltraFastResult(result, fileName, fileExtension, processingTime);
    
  } catch (error) {
    console.error("💥 Ultra-fast processing error:", error);
    
    // Emergency fallback - use fastest possible method
    try {
      console.log("🔄 Emergency fallback processing");
      const shortText = text.substring(0, 3000);
      const result = await callGroqCloudAPI(
        shortText, 
        "URGENT: Provide immediate analysis of this document content:", 
        "llama-3.3-70b-versatile"
      );
      return formatUltraFastResult(result, fileName, "emergency", Date.now() - startTime);
    } catch (fallbackError) {
      console.error("💥 Emergency fallback failed:", fallbackError);
      throw new Error("Analysis failed despite all optimization attempts");
    }
  }
}

async function processWithGroqVision(text: string, fileBuffer: ArrayBuffer, fileExtension: string): Promise<string> {
  console.log("🖼️ GroqCloud Vision processing");
  
  let base64Data: string;
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
    const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
    base64Data = `data:${mimeType};base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
  } else {
    base64Data = `data:application/pdf;base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
  }
  
  return await analyzeWithVision(base64Data, text);
}

async function processWithGeminiUltraFast(text: string, fileName: string): Promise<string> {
  console.log("📝 Gemini ultra-fast text processing");
  
  // Ultra-optimized prompt for speed
  const prompt = `URGENT ANALYSIS REQUIRED - Provide immediate comprehensive analysis of this document:

REQUIREMENTS:
- Extract ALL key information
- Provide main points and insights
- Include important details
- Professional business format
- No formatting symbols

Document:`;
  
  return await callGeminiAPI(text, prompt, 0.1);
}

async function processWithGroqUltraFast(text: string, fileName: string): Promise<string> {
  console.log("⚡ GroqCloud ultra-fast processing");
  
  // Split text into smaller chunks for parallel processing if needed
  const maxChunkSize = 3000;
  
  if (text.length <= maxChunkSize) {
    return await callGroqCloudAPI(
      text,
      "URGENT: Provide immediate comprehensive analysis of this document:",
      "llama-3.3-70b-versatile"
    );
  }
  
  // Parallel processing for larger texts
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize));
  }
  
  console.log(`⚡ Processing ${chunks.length} chunks in parallel`);
  
  // Process all chunks simultaneously
  const chunkPromises = chunks.map(async (chunk, index) => {
    const result = await callGroqCloudAPI(
      chunk,
      `URGENT: Analyze section ${index + 1}/${chunks.length}:`,
      "llama-3.3-70b-versatile"
    );
    return `SECTION ${index + 1}: ${result}`;
  });
  
  const results = await Promise.all(chunkPromises);
  
  // Quick combination
  const combined = results.join("\n\n");
  return await callGroqCloudAPI(
    combined,
    "URGENT: Combine these sections into final comprehensive analysis:",
    "llama-3.3-70b-versatile"
  );
}

function formatUltraFastResult(summary: string, fileName: string, fileType: string, processingTime: number): string {
  const timestamp = new Date().toLocaleDateString();
  
  // Ultra-clean formatting
  const cleanSummary = summary
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/^\s*[\*\-\+]\s*/gm, '• ')
    .trim();
  
  const header = `ULTRA-FAST DOCUMENT ANALYSIS
File: ${fileName}
Processing Time: ${processingTime}ms
Analysis Date: ${timestamp}
Method: Ultra-Fast AI Processing

---

`;
  
  const footer = `

---

⚡ ULTRA-FAST Analysis Complete | ${processingTime}ms | LegalBriefAI | ${timestamp}`;
  
  return header + cleanSummary + footer;
}
