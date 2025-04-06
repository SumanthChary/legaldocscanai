/**
 * Smart chunking that preserves document structure
 * Breaks text into optimal chunks while maintaining coherence
 */
export function smartChunking(text: string): string[] {
  const MAX_CHUNK_SIZE = 12000;
  
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
