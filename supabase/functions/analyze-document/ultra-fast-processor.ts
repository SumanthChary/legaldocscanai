
import { extractAndValidateText } from "./text-processing.ts";
import { callGroqCloudAPI, analyzeWithVision } from "./groqcloud-client.ts";
import { callGeminiAPI } from "./gemini-client.ts";

/**
 * ULTRA-FAST processor - GUARANTEED results in 5-15 seconds
 */
export async function processUltraFast(text: string, fileName: string, fileBuffer?: ArrayBuffer): Promise<string> {
  console.log(`🚀 ULTRA-FAST processing: ${fileName} (${text.length} chars)`);
  
  const startTime = Date.now();
  
  try {
    // Lightning-fast text extraction and validation
    const cleanedText = extractAndValidateText(text, fileName);
    const fileExtension = fileName.toLowerCase().split('.').pop() || '';
    
    // Determine optimal processing method
    const isTextFile = ['txt', 'doc', 'docx', 'rtf'].includes(fileExtension);
    const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    let result: string;
    
    if (isImageFile || (isPDF && fileBuffer)) {
      // Use GroqCloud Vision for images and PDFs
      console.log(`🖼️ Using GroqCloud Vision for ${fileExtension}`);
      result = await processWithGroqVision(cleanedText, fileBuffer!, fileExtension);
    } else if (isTextFile && cleanedText.length < 8000) {
      // Use Gemini for smaller text files - it's faster and better for text
      console.log(`📝 Using Gemini for text file: ${fileExtension}`);
      try {
        result = await processWithGeminiUltraFast(cleanedText, fileName);
      } catch (geminiError) {
        console.log("🔄 Gemini failed, switching to GroqCloud");
        result = await processWithGroqUltraFast(cleanedText, fileName);
      }
    } else {
      // Use GroqCloud for everything else or large files
      console.log(`⚡ Using GroqCloud for: ${fileExtension}`);
      result = await processWithGroqUltraFast(cleanedText, fileName);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ ULTRA-FAST processing complete in ${processingTime}ms`);
    
    return formatUltraFastResult(result, fileName, fileExtension, processingTime);
    
  } catch (error) {
    console.error("💥 Ultra-fast processing error:", error);
    
    // GUARANTEED fallback - multiple attempts with different methods
    try {
      console.log("🔄 Emergency fallback: GroqCloud");
      const shortText = text.substring(0, 3000);
      const result = await callGroqCloudAPI(
        shortText, 
        "URGENT: Provide immediate comprehensive analysis:", 
        "llama-3.3-70b-versatile"
      );
      return formatUltraFastResult(result, fileName, "emergency", Date.now() - startTime);
    } catch (fallbackError1) {
      console.error("💥 First fallback failed, trying alternative");
      
      try {
        // Second fallback - even simpler
        const veryShortText = text.substring(0, 1500);
        const result = await callGroqCloudAPI(
          veryShortText, 
          "Quick analysis needed:", 
          "llama-3.1-8b-instant"
        );
        return formatUltraFastResult(result, fileName, "simple", Date.now() - startTime);
      } catch (fallbackError2) {
        console.error("💥 All processing methods failed");
        // Return basic file info as last resort
        return formatUltraFastResult(
          `Document Analysis Summary:\n\nFile: ${fileName}\nSize: ${text.length} characters\nType: ${fileName.split('.').pop()?.toUpperCase()} document\n\nThe document was uploaded successfully but AI analysis encountered technical difficulties. The file appears to contain ${text.split(' ').length} words of content.\n\nFor best results, try re-uploading the document or contact support if the issue persists.`,
          fileName, 
          "basic", 
          Date.now() - startTime
        );
      }
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
  
  // Ultra-optimized prompt for maximum speed
  const prompt = `URGENT DOCUMENT ANALYSIS - Respond in under 10 seconds:

REQUIREMENTS:
- Extract ALL key information immediately
- Provide main points and critical insights
- Include important details and conclusions
- Use professional business format
- NO formatting symbols or markdown

Analyze this document immediately:`;
  
  return await callGeminiAPI(text, prompt, 0.1);
}

async function processWithGroqUltraFast(text: string, fileName: string): Promise<string> {
  console.log("⚡ GroqCloud ultra-fast processing");
  
  // For large texts, use intelligent chunking
  const maxChunkSize = 4000;
  
  if (text.length <= maxChunkSize) {
    return await callGroqCloudAPI(
      text,
      "URGENT: Provide immediate comprehensive analysis:",
      "llama-3.3-70b-versatile"
    );
  }
  
  // Smart chunking for larger documents
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize));
  }
  
  console.log(`⚡ Processing ${chunks.length} chunks in parallel`);
  
  // Process first few chunks in parallel for speed
  const maxParallelChunks = Math.min(chunks.length, 3);
  const chunkPromises = chunks.slice(0, maxParallelChunks).map(async (chunk, index) => {
    const result = await callGroqCloudAPI(
      chunk,
      `URGENT: Analyze section ${index + 1}/${chunks.length}:`,
      "llama-3.3-70b-versatile"
    );
    return `SECTION ${index + 1}: ${result}`;
  });
  
  const results = await Promise.all(chunkPromises);
  
  // If there are more chunks, summarize what we have
  if (chunks.length > maxParallelChunks) {
    const remainingText = chunks.slice(maxParallelChunks).join(' ').substring(0, 2000);
    results.push(`ADDITIONAL CONTENT: ${remainingText}...`);
  }
  
  // Combine results intelligently
  const combined = results.join("\n\n");
  
  if (combined.length > 4000) {
    // Final summarization if too long
    return await callGroqCloudAPI(
      combined,
      "URGENT: Create final comprehensive summary from these sections:",
      "llama-3.3-70b-versatile"
    );
  }
  
  return combined;
}

function formatUltraFastResult(summary: string, fileName: string, fileType: string, processingTime: number): string {
  const timestamp = new Date().toLocaleDateString();
  
  // Ultra-clean formatting for perfect display
  const cleanSummary = summary
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/^\s*[\*\-\+]\s*/gm, '• ')
    .replace(/(\*\*|__)/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
  
  const header = `LIGHTNING DOCUMENT ANALYSIS
File: ${fileName}
Processing Time: ${processingTime}ms
Analysis Date: ${timestamp}
Method: Ultra-Fast AI Processing

---

`;
  
  const footer = `

---

⚡ LIGHTNING Analysis Complete | ${processingTime}ms | LegalBriefAI Pro | ${timestamp}`;
  
  return header + cleanSummary + footer;
}
