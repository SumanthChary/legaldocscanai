
// Enhanced text processing utilities for different document formats with improved cleaning

/**
 * Enhanced PDF text cleaning with comprehensive formatting improvements
 */
export function enhancedPdfTextCleaning(text: string): string {
  return text
    // Handle PDF-specific formatting issues
    .replace(/\f/g, '\n\n') // Form feed to paragraph break
    .replace(/(\r\n|\r|\n){3,}/g, '\n\n') // Normalize excessive line breaks
    .replace(/[^\x20-\x7E\n\t\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/g, ' ') // Remove problematic chars but keep extended Latin
    
    // Fix common PDF text extraction issues
    .replace(/([a-z])(\d+)([A-Z])/g, '$1 $2 $3') // Fix merged words with numbers
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Fix camelCase splits
    .replace(/(\d)([A-Z])/g, '$1 $2') // Fix number-letter merges
    .replace(/([.!?])([A-Z])/g, '$1 $2') // Fix sentence spacing
    
    // Improve spacing and formatting
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/•\s*/g, '• ') // Fix bullet points
    .replace(/([.!?])\s*\n/g, '$1\n\n') // Proper paragraph breaks after sentences
    .replace(/(\d+)\.\s*([A-Z])/g, '$1. $2') // Fix numbered lists
    
    // Fix broken sentences across lines
    .replace(/([a-z,])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences (lowercase to lowercase)
    .replace(/([^.!?:])\s*\n\s*([a-z])/g, '$1 $2') // Fix mid-sentence breaks
    
    // Remove common PDF artifacts
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '') // Remove page numbers
    .replace(/^\s*(Page|\d+)\s*$\n/gm, '') // Remove isolated page markers
    .replace(/Header:|Footer:|Footnote:/gi, '') // Remove header/footer markers
    
    // Improve date and number formatting
    .replace(/(\d{1,2})[\-\–](\d{1,2})[\-\–](\d{2,4})/g, '$1-$2-$3') // Standardize dates
    .replace(/\$\s*(\d)/g, '$$$1') // Fix currency formatting
    .replace(/(\d)\s*%/g, '$1%') // Fix percentage formatting
    
    // Clean up and finalize
    .replace(/\n{3,}/g, '\n\n') // Final cleanup of excessive breaks
    .trim();
}

/**
 * Enhanced Word document text cleaning with comprehensive formatting improvements
 */
export function enhancedWordTextCleaning(text: string): string {
  return text
    // Remove Word-specific artifacts
    .replace(/\[IMAGE\]/gi, '[Image]') 
    .replace(/\[TABLE.*?\]/gi, '[Table]')
    .replace(/\[CHART.*?\]/gi, '[Chart]')
    .replace(/\[FIGURE\d*.*?\]/gi, '[Figure]')
    .replace(/\[PAGE\d*\]/gi, '')
    .replace(/\[HYPERLINK.*?\]/gi, '')
    
    // Handle Word formatting codes
    .replace(/\{.*?\}/g, '') // Remove Word field codes
    .replace(/_x000[0-9A-F]_/g, ' ') // Remove Word encoding artifacts
    
    // Fix common Word text issues
    .replace(/(\r\n|\r|\n){3,}/g, '\n\n') // Normalize line breaks
    .replace(/\s{2,}/g, ' ') // Collapse spaces
    .replace(/•\s*/g, '• ') // Fix bullet points
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .replace(/([^.!?:])\s*\n\s*([a-z])/g, '$1 $2') // Fix line breaks in sentences
    
    // Remove Word headers and footers
    .replace(/^Header\s*:.*?$/gm, '') // Remove headers
    .replace(/^Footer\s*:.*?$/gm, '') // Remove footers
    .replace(/^Footnote\s*:.*?$/gm, '') // Remove footnote markers
    .replace(/^\s*\d+\s*$/gm, '') // Remove isolated page numbers
    
    // Fix Word table artifacts
    .replace(/\|\s*\|/g, '|') // Clean table separators
    .replace(/\s*\|\s*/g, ' | ') // Standardize table formatting
    
    // Improve formatting
    .replace(/([.!?])\s*\n/g, '$1\n\n') // Proper paragraph breaks
    .replace(/(\d+)\.\s*([A-Z])/g, '$1. $2') // Fix numbered lists
    .replace(/([^\w])(\d{1,2})[\-\–](\d{1,2})[\-\–](\d{2,4})([^\w])/g, '$1$2-$3-$4$5') // Fix dates
    
    .trim();
}

/**
 * Enhanced standard text cleaning for plain text files
 */
export function standardTextCleaning(text: string): string {
  return text
    // Normalize line endings and spacing
    .replace(/\r\n/g, '\n') // Convert Windows line endings
    .replace(/\r/g, '\n') // Convert Mac line endings
    .replace(/(\n\s*){3,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/[ \t]{2,}/g, ' ') // Collapse horizontal whitespace
    
    // Fix common text issues
    .replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2') // Join broken sentences
    .replace(/([^.!?:])\s*\n\s*([a-z])/g, '$1 $2') // Fix mid-sentence breaks
    
    // Improve paragraph structure
    .replace(/([.!?])\s*\n\s*([A-Z])/g, '$1\n\n$2') // Proper paragraph breaks
    .replace(/(\d+)\.\s*([A-Z])/g, '$1. $2') // Fix numbered lists
    
    // Clean up encoding issues
    .replace(/â€™/g, "'") // Fix smart apostrophes
    .replace(/â€œ/g, '"') // Fix smart quotes open
    .replace(/â€\u009D/g, '"') // Fix smart quotes close
    .replace(/â€"/g, '—') // Fix em dashes
    .replace(/â€"/g, '–') // Fix en dashes
    
    .trim();
}

/**
 * Enhanced binary detection with more sophisticated checks
 */
export function containsBinaryIndicators(text: string): boolean {
  // Check for high concentration of unprintable characters
  const sample = text.substring(0, 2000); // Larger sample for better detection
  const unprintableCount = (sample.match(/[^\x20-\x7E\n\t\r\u00A0-\u00FF]/g) || []).length;
  const unprintableRatio = unprintableCount / sample.length;
  
  // Check for specific binary file signatures
  const binarySignatures = [
    /^%PDF-/,           // PDF header
    /^PK\x03\x04/,      // ZIP/Office files
    /^�PNG/,            // PNG images
    /^GIF8/,            // GIF images
    /^JFIF/,            // JPEG images
    /^\xFF\xD8\xFF/,    // JPEG header
    /^BM/,              // Bitmap images
    /^RIFF.*WAVE/,      // WAV audio
    /^\x89PNG/,         // PNG alternative
  ];
  
  const startsWithBinary = binarySignatures.some(signature => 
    signature.test(sample.substring(0, 50))
  );
  
  // Enhanced detection criteria
  return (
    unprintableRatio > 0.2 || // High ratio of unprintable characters
    startsWithBinary ||        // Known binary file signature
    sample.includes('\0') ||   // Null bytes (common in binary)
    /[\x00-\x08\x0E-\x1F]/.test(sample.substring(0, 100)) // Control characters at start
  );
}

/**
 * Smart text preprocessing that determines the best cleaning approach
 */
export function smartTextPreprocessing(text: string, fileName: string): string {
  console.log(`Smart preprocessing for: ${fileName}`);
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // First check for binary content
  if (containsBinaryIndicators(text)) {
    throw new Error(`File appears to contain binary data that cannot be processed as text: ${fileName}`);
  }
  
  // Apply format-specific cleaning
  switch (extension) {
    case 'pdf':
      return enhancedPdfTextCleaning(text);
    case 'doc':
    case 'docx':
      return enhancedWordTextCleaning(text);
    case 'txt':
    case 'text':
      return standardTextCleaning(text);
    default:
      // For unknown formats, use standard cleaning with extra validation
      const cleaned = standardTextCleaning(text);
      
      // Validate that we have meaningful text content
      if (cleaned.trim().length < 20) {
        throw new Error(`Document contains insufficient readable text content: ${fileName}`);
      }
      
      return cleaned;
  }
}

/**
 * Extract and clean text with enhanced validation
 */
export function extractAndValidateText(text: string, fileName: string): string {
  console.log(`Extracting and validating text from: ${fileName}, length: ${text.length}`);
  
  // Smart preprocessing
  const cleanedText = smartTextPreprocessing(text, fileName);
  
  // Validation checks
  if (!cleanedText || cleanedText.trim().length === 0) {
    throw new Error('No readable text content found in the document');
  }
  
  if (cleanedText.trim().length < 50) {
    throw new Error('Document contains insufficient text content for meaningful analysis');
  }
  
  // Check for reasonable text-to-noise ratio
  const words = cleanedText.split(/\s+/).filter(word => word.length > 2);
  if (words.length < 10) {
    throw new Error('Document does not contain enough recognizable words for analysis');
  }
  
  console.log(`Successfully extracted ${cleanedText.length} characters, ${words.length} words`);
  return cleanedText;
}
