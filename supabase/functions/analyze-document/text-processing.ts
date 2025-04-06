
// Text processing utilities for different document formats

/**
 * Enhanced PDF text cleaning with specific formatting improvements
 */
export function enhancedPdfTextCleaning(text: string): string {
  return text
    .replace(/\f/g, '\n\n') // Form feed to paragraph break
    .replace(/(\r\n|\r|\n){2,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/[^\x20-\x7E\n\t]/g, ' ') // Remove non-printable characters
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/•\s*/g, '• ') // Fix bullet points
    .replace(/([.!?])\s*\n/g, '$1\n\n') // Make sure sentences end with proper spacing
    .replace(/(\d+)\.\s*([A-Z])/g, '$1. $2') // Fix numbered lists
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .replace(/([^.!?:])\s*\n\s*([a-z])/g, '$1 $2') // Fix line breaks in middle of sentences
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '') // Remove page numbers
    .replace(/^\s*(Page|\d+)\s*$\n/gm, '') // Remove isolated page markers
    .replace(/([^\w])(\d{1,2})[\-\–](\d{1,2})[\-\–](\d{2,4})([^\w])/g, '$1$2-$3-$4$5') // Fix date formats
    .trim();
}

/**
 * Enhanced Word document text cleaning with specific formatting improvements
 */
export function enhancedWordTextCleaning(text: string): string {
  return text
    .replace(/\[IMAGE\]/gi, '') 
    .replace(/\[TABLE.*?\]/gi, '')
    .replace(/\[CHART.*?\]/gi, '')
    .replace(/\[FIGURE\d*.*?\]/gi, '')
    .replace(/\[PAGE\d*\]/gi, '')
    .replace(/(\r\n|\r|\n){2,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/•\s*/g, '• ') // Fix bullet points
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .replace(/([^.!?:])\s*\n\s*([a-z])/g, '$1 $2') // Fix line breaks in middle of sentences
    .replace(/Header\s*:.*?\n/gi, '') // Remove headers
    .replace(/Footer\s*:.*?\n/gi, '') // Remove footers
    .replace(/Footnote\s*:.*?\n/gi, '') // Remove footnote markers
    .replace(/^\s*\d+\s*$\n/gm, '') // Remove isolated page numbers
    .replace(/([^\w])(\d{1,2})[\-\–](\d{1,2})[\-\–](\d{2,4})([^\w])/g, '$1$2-$3-$4$5') // Fix date formats
    .trim();
}

/**
 * Standard text cleaning for basic text files
 */
export function standardTextCleaning(text: string): string {
  return text
    .replace(/(\r\n|\r|\n){2,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .trim();
}

/**
 * Detect if text likely contains binary data by checking for unprintable characters
 */
export function containsBinaryIndicators(text: string): boolean {
  // Check for high concentration of unprintable characters
  const unprintableCount = (text.substring(0, 1000).match(/[^\x20-\x7E\n\t]/g) || []).length;
  const unprintableRatio = unprintableCount / Math.min(1000, text.length);
  
  return (
    // High ratio of unprintable characters at start of file
    unprintableRatio > 0.3 ||
    // Specific binary file signatures near the start
    text.substring(0, 50).includes('�PNG') ||
    text.substring(0, 50).includes('JFIF') ||
    text.substring(0, 50).includes('%PDF-') && text.indexOf('�') < 100
  );
}
