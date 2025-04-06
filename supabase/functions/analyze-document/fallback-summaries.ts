
/**
 * Generates appropriate fallback summary text based on error type and file information
 */
export function generateFallbackSummary(error: any, fileName: string, fileText?: string): string {
  let fallbackSummary = null;
  const fileExt = fileName.split('.').pop()?.toLowerCase();
  
  if (error.message?.includes("timed out")) {
    fallbackSummary = "This document was too large to process completely. Try uploading a smaller section or dividing it into multiple parts for better results.";
  } else if (error.message?.includes("binary")) {
    if (fileExt === 'pdf') {
      fallbackSummary = "This PDF appears to be image-based, encrypted, or contains complex formatting that our system couldn't process. For best results, try converting it to text first using an OCR tool.";
    } else if (['doc', 'docx'].includes(fileExt || '')) {
      fallbackSummary = "This Word document contains elements we couldn't process. Try saving it as a plain text (.txt) file first or copy/paste the content directly into a new text document.";
    } else {
      fallbackSummary = "This appears to be a binary or non-text document format that we couldn't process. Please try converting it to a text format first.";
    }
  } else if (error.message?.includes("insufficient text")) {
    fallbackSummary = "This document doesn't contain enough text content to generate a meaningful summary. Please check that it contains actual text content and not just images or formatting.";
  } else if (fileText && fileText.length > 0) {
    // If we have text but the API failed, try to provide some direct content
    const previewText = fileText.substring(0, 500).replace(/\s+/g, ' ').trim();
    fallbackSummary = `We encountered difficulties analyzing this document with our AI, but here's a preview of the content:\n\n${previewText}...\n\n(This is a direct excerpt as AI processing was unsuccessful. Please try again with a different file format or divide the document into smaller parts.)`;
  } else {
    // File type specific generic fallbacks
    if (fileExt === 'pdf') {
      fallbackSummary = "We couldn't extract text from this PDF. It might be scanned, image-based, or encrypted. Try using an OCR tool first or upload a text version of the document.";
    } else if (['doc', 'docx'].includes(fileExt || '')) {
      fallbackSummary = "We had trouble processing this Word document. For best results, save it as a plain text (.txt) file before uploading or try copying the text directly into a new document.";
    } else {
      fallbackSummary = "We were unable to generate a summary for this document. It may be in an unsupported format or contain content that's difficult to analyze. Try converting it to a plain text format first.";
    }
  }
  
  return fallbackSummary || "We were unable to analyze this document. Please try a different format or contact support.";
}
