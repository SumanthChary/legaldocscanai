
/**
 * Generate detailed prompts based on document context and analysis type
 */
export function getDetailedPrompt(type: "complete" | "chunk" | "combine", chunkNum?: number, totalChunks?: number): string {
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
