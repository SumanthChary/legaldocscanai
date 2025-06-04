
/**
 * Ultra-optimized smart chunking for maximum speed
 */
export function smartChunking(text: string, maxChunkSize: number = 4000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }
  
  const chunks: string[] = [];
  let currentPosition = 0;
  
  while (currentPosition < text.length) {
    let chunkEnd = Math.min(currentPosition + maxChunkSize, text.length);
    
    // Find natural break point for better analysis
    if (chunkEnd < text.length) {
      const lastPeriod = text.lastIndexOf('.', chunkEnd);
      const lastNewline = text.lastIndexOf('\n', chunkEnd);
      const breakPoint = Math.max(lastPeriod, lastNewline);
      
      if (breakPoint > currentPosition + maxChunkSize * 0.7) {
        chunkEnd = breakPoint + 1;
      }
    }
    
    const chunk = text.slice(currentPosition, chunkEnd).trim();
    if (chunk.length > 50) { // Only add meaningful chunks
      chunks.push(chunk);
    }
    
    currentPosition = chunkEnd;
  }
  
  console.log(`⚡ Smart chunking: ${text.length} chars → ${chunks.length} chunks`);
  return chunks;
}
