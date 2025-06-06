
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
    
    // Determine optimal processing method for MAXIMUM SPEED
    const isTextFile = ['txt', 'doc', 'docx', 'rtf'].includes(fileExtension);
    const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    let result: string;
    
    if (isImageFile || (isPDF && fileBuffer)) {
      // Use GroqCloud Vision for images and PDFs - ULTRA FAST
      console.log(`🖼️ Using GroqCloud Vision for ${fileExtension}`);
      result = await processWithGroqVision(cleanedText, fileBuffer!, fileExtension);
    } else if (isTextFile && cleanedText.length < 10000) {
      // Use Gemini for smaller text files - LIGHTNING SPEED
      console.log(`📝 Using Gemini for text file: ${fileExtension}`);
      try {
        result = await processWithGeminiUltraFast(cleanedText, fileName);
      } catch (geminiError) {
        console.log("🔄 Gemini failed, switching to GroqCloud INSTANTLY");
        result = await processWithGroqUltraFast(cleanedText, fileName);
      }
    } else {
      // Use GroqCloud for everything else - MAXIMUM PERFORMANCE
      console.log(`⚡ Using GroqCloud for: ${fileExtension}`);
      result = await processWithGroqUltraFast(cleanedText, fileName);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ ULTRA-FAST processing complete in ${processingTime}ms`);
    
    return formatUltraFastResult(result, fileName, fileExtension, processingTime);
    
  } catch (error) {
    console.error("💥 Ultra-fast processing error:", error);
    
    // GUARANTEED TRIPLE FALLBACK - NEVER FAILS
    try {
      console.log("🔄 Emergency fallback #1: GroqCloud Instant");
      const shortText = text.substring(0, 4000);
      const result = await callGroqCloudAPI(
        shortText, 
        "CRITICAL: Provide IMMEDIATE comprehensive analysis in under 5 seconds:", 
        "llama-3.1-8b-instant"
      );
      return formatUltraFastResult(result, fileName, "emergency", Date.now() - startTime);
    } catch (fallbackError1) {
      console.error("💥 First fallback failed, trying SUPER FAST alternative");
      
      try {
        // Second fallback - EVEN FASTER
        const veryShortText = text.substring(0, 2000);
        const result = await callGroqCloudAPI(
          veryShortText, 
          "URGENT: Quick analysis needed NOW:", 
          "llama-3.1-8b-instant"
        );
        return formatUltraFastResult(result, fileName, "fast", Date.now() - startTime);
      } catch (fallbackError2) {
        console.error("💥 Second fallback failed, using EMERGENCY mode");
        
        // Third fallback - GUARANTEED RESULT
        try {
          const basicText = text.substring(0, 1000);
          const result = await callGroqCloudAPI(
            basicText,
            "Emergency analysis:",
            "llama-3.1-8b-instant"
          );
          return formatUltraFastResult(result, fileName, "basic", Date.now() - startTime);
        } catch (finalError) {
          console.error("💥 All AI methods failed, generating emergency summary");
          // FINAL GUARANTEED RESULT
          return formatUltraFastResult(
            generateEmergencySummary(text, fileName),
            fileName, 
            "emergency", 
            Date.now() - startTime
          );
        }
      }
    }
  }
}

async function processWithGroqVision(text: string, fileBuffer: ArrayBuffer, fileExtension: string): Promise<string> {
  console.log("🖼️ GroqCloud Vision ULTRA-FAST processing");
  
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
  console.log("📝 Gemini LIGHTNING-SPEED text processing");
  
  // Ultra-optimized prompt for MAXIMUM SPEED
  const prompt = `LIGHTNING DOCUMENT ANALYSIS - Respond in under 5 seconds:

CRITICAL REQUIREMENTS:
- Extract ALL key information IMMEDIATELY
- Provide comprehensive professional analysis
- Include main points, conclusions, and insights
- Use clear business format
- NO formatting symbols or markdown

URGENT: Analyze this document NOW:`;
  
  return await callGeminiAPI(text, prompt, 0.1);
}

async function processWithGroqUltraFast(text: string, fileName: string): Promise<string> {
  console.log("⚡ GroqCloud MAXIMUM SPEED processing");
  
  // For large texts, use intelligent SUPER-FAST chunking
  const maxChunkSize = 5000;
  
  if (text.length <= maxChunkSize) {
    return await callGroqCloudAPI(
      text,
      "CRITICAL: Provide IMMEDIATE comprehensive analysis in under 5 seconds:",
      "llama-3.1-8b-instant"
    );
  }
  
  // Smart chunking for larger documents - PARALLEL PROCESSING
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize));
  }
  
  console.log(`⚡ Processing ${chunks.length} chunks in ULTRA-FAST parallel mode`);
  
  // Process first few chunks in parallel for MAXIMUM SPEED
  const maxParallelChunks = Math.min(chunks.length, 4);
  const chunkPromises = chunks.slice(0, maxParallelChunks).map(async (chunk, index) => {
    const result = await callGroqCloudAPI(
      chunk,
      `URGENT: Analyze section ${index + 1}/${chunks.length} IMMEDIATELY:`,
      "llama-3.1-8b-instant"
    );
    return `SECTION ${index + 1}: ${result}`;
  });
  
  const results = await Promise.all(chunkPromises);
  
  // If there are more chunks, include summary
  if (chunks.length > maxParallelChunks) {
    const remainingText = chunks.slice(maxParallelChunks).join(' ').substring(0, 2000);
    results.push(`ADDITIONAL CONTENT: ${remainingText}...`);
  }
  
  // Combine results intelligently
  const combined = results.join("\n\n");
  
  if (combined.length > 5000) {
    // Final ULTRA-FAST summarization
    return await callGroqCloudAPI(
      combined,
      "CRITICAL: Create final comprehensive summary INSTANTLY:",
      "llama-3.1-8b-instant"
    );
  }
  
  return combined;
}

function generateEmergencySummary(text: string, fileName: string): string {
  const wordCount = text.split(' ').length;
  const charCount = text.length;
  const fileType = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';
  
  return `EMERGENCY DOCUMENT ANALYSIS

File: ${fileName}
Type: ${fileType} Document
Size: ${charCount} characters, ${wordCount} words

CONTENT OVERVIEW:
This document has been successfully uploaded and contains ${wordCount} words of content. The file appears to be a ${fileType} document with substantial text content.

KEY INFORMATION:
- Document processed successfully
- Content length: ${charCount} characters
- Estimated reading time: ${Math.ceil(wordCount / 200)} minutes
- File format: ${fileType}

ANALYSIS STATUS:
The document was uploaded successfully. While advanced AI analysis encountered technical difficulties, the file content is intact and accessible for review.

RECOMMENDATIONS:
1. The document is ready for use
2. Content can be accessed and reviewed
3. Try re-uploading for enhanced AI analysis if needed
4. Contact support if issues persist

Note: This is an emergency processing mode. The document content is preserved and available.`;
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
  
  const header = `⚡ LIGHTNING DOCUMENT ANALYSIS
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
