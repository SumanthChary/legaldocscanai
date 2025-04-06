const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

// Improved Gemini analysis function with better error handling, fallback strategies, and enhanced prompts
export async function analyzeWithGemini(text: string): Promise<string> {
  console.log("Analyzing with Gemini... Text length:", text.length);
  
  // Check if the text is empty or contains only whitespace
  if (!text || text.trim().length === 0) {
    return "The document appears to be empty or contains only formatting. Please check the document and try again.";
  }
  
  // Clean the text to remove problematic characters
  const cleanedText = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  // Smart chunking for very large documents
  const chunks = smartChunking(cleanedText);
  
  try {
    if (chunks.length === 1) {
      // For documents that fit in a single chunk
      console.log("Attempting complete document analysis with enhanced prompting");
      const summary = await callGeminiAPI(
        chunks[0],
        getDetailedPrompt("complete"),
        0.3
      );
      return summary;
    } else {
      // For documents that needed to be chunked
      console.log(`Document required chunking into ${chunks.length} parts`);
      
      // Process each chunk and then combine the results
      const chunkSummaries = [];
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chunk ${i+1}/${chunks.length}`);
        const chunkSummary = await callGeminiAPI(
          chunks[i],
          getDetailedPrompt("chunk", i+1, chunks.length),
          0.3
        );
        chunkSummaries.push(chunkSummary);
      }
      
      // Combine chunk summaries into a coherent whole
      const combinedText = chunkSummaries.join("\n\n--- Next Section ---\n\n");
      console.log("Creating final combined summary");
      
      // Final pass to create a coherent summary from the chunks
      const finalSummary = await callGeminiAPI(
        combinedText,
        getDetailedPrompt("combine"),
        0.2
      );
      
      return finalSummary;
    }
  } catch (error) {
    console.error("Primary analysis approach failed:", error);
    
    // Enhanced fallback approach
    try {
      const shorterText = chunks[0].substring(0, 8000);
      console.log("Retrying with comprehensive fallback approach");
      
      const fallbackSummary = await callGeminiAPI(
        shorterText,
        "Provide a comprehensive and detailed summary of this document, covering all key points, findings, and information:", 
        0.2
      );
      return fallbackSummary;
    } catch (secondError) {
      console.error("Enhanced fallback approach failed:", secondError);
      
      // Final simplified fallback
      try {
        const minimalText = chunks[0].substring(0, 3000);
        console.log("Final attempt with minimal text");
        
        const minimalSummary = await callGeminiAPI(
          minimalText,
          "Summarize this document text as thoroughly as possible:", 
          0.1
        );
        return minimalSummary;
      } catch (finalError) {
        console.error("All Gemini API attempts failed:", finalError);
        
        // Last resort extraction
        const extractedContent = chunks[0].substring(0, 500);
        
        return `We encountered challenges processing this document fully, but here's what we found:\n\n${extractedContent}...\n\n(Note: This is a partial extraction as the AI processing encountered difficulties with the full document.)`;
      }
    }
  }
}

// Smart chunking that preserves document structure
function smartChunking(text: string): string[] {
  const MAX_CHUNK_SIZE = 12000; // Increased from previous implementation
  
  if (text.length <= MAX_CHUNK_SIZE) {
    return [text]; // No chunking needed
  }
  
  const chunks: string[] = [];
  let currentIndex = 0;
  
  while (currentIndex < text.length) {
    // Try to find a good breaking point near MAX_CHUNK_SIZE
    let breakPoint = currentIndex + MAX_CHUNK_SIZE;
    
    if (breakPoint >= text.length) {
      // Last chunk
      chunks.push(text.substring(currentIndex));
      break;
    }
    
    // Look for natural break points like paragraph ends, headings, sections
    const paragraphBreak = text.lastIndexOf('\n\n', breakPoint);
    const sectionBreak = text.lastIndexOf('\n## ', breakPoint);
    const headingBreak = text.lastIndexOf('\n# ', breakPoint);
    
    // Find the best break point that doesn't go too far back
    const potentialBreaks = [paragraphBreak, sectionBreak, headingBreak]
      .filter(bp => bp > currentIndex && bp > currentIndex + (MAX_CHUNK_SIZE * 0.7)); // At least 70% of max size
    
    if (potentialBreaks.length > 0) {
      // Use the latest natural break point
      breakPoint = Math.max(...potentialBreaks) + 2; // +2 to include the newline
    } else {
      // Fall back to sentence boundary if no good structural breaks
      const sentenceBreak = text.lastIndexOf('. ', breakPoint);
      if (sentenceBreak > currentIndex + (MAX_CHUNK_SIZE * 0.5)) { // At least 50% of max size
        breakPoint = sentenceBreak + 2; // +2 to include the period and space
      }
      // Otherwise use the original breakpoint
    }
    
    chunks.push(text.substring(currentIndex, breakPoint));
    currentIndex = breakPoint;
  }
  
  return chunks;
}

// Generate detailed prompts based on document context
function getDetailedPrompt(type: "complete" | "chunk" | "combine", chunkNum?: number, totalChunks?: number): string {
  switch (type) {
    case "complete":
      return `Provide a comprehensive, detailed, and structured analysis of this document. 
      
      Your summary should include:
      
      1. Main purpose and topic of the document
      2. Key findings, arguments, or data presented
      3. Important details and supporting evidence
      4. Any conclusions or recommendations
      5. Structure your analysis with clear sections and bullet points when appropriate
      
      Aim to capture ALL significant information so the reader doesn't need to reference the original document. Be thorough but concise, prioritizing accuracy and completeness.
      
      Document content:
      """`;
    
    case "chunk":
      return `This is part ${chunkNum} of ${totalChunks} from a larger document. Please analyze this section thoroughly, capturing all key information.
      
      Focus on:
      1. Main topics and arguments in this section
      2. Any important data, facts or figures presented
      3. Key supporting information and context
      4. Any partial conclusions or findings
      
      Document section content (part ${chunkNum}/${totalChunks}):
      """`;
    
    case "combine":
      return `Below are summaries from different sections of a document. Please combine them into one cohesive, comprehensive summary.
      
      Your combined summary should:
      1. Present a unified view of the entire document
      2. Maintain all key information from each section
      3. Eliminate redundancies
      4. Ensure proper flow and logical organization
      5. Provide a complete picture of the document's content, findings, and conclusions
      
      Section summaries to combine:
      """`;
    
    default:
      return "Analyze and summarize this document thoroughly:";
  }
}

async function callGeminiAPI(text: string, promptPrefix: string, temperature = 0.3): Promise<string> {
  console.log(`Calling Gemini API with text length: ${text.length}, temperature: ${temperature}`);
  
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${promptPrefix}
            
            ${text}
            """
            
            Please provide a comprehensive and structured summary that captures ALL the key information.`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 4096, // Significantly increased token limit for more detailed summaries
          topP: 0.95,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Extract the content from Gemini response
    if (
      result.candidates && 
      result.candidates[0]?.content?.parts && 
      result.candidates[0].content.parts[0]?.text
    ) {
      const summary = result.candidates[0].content.parts[0].text.trim();
      console.log("Successfully generated summary:", summary.substring(0, 100) + "...");
      return summary;
    } else {
      console.error("Unexpected Gemini response format:", JSON.stringify(result));
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
