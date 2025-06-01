
/**
 * Enhanced error handling system for document analysis
 */

export interface AnalysisError {
  type: 'validation' | 'processing' | 'api' | 'system';
  message: string;
  code: string;
  recoverable: boolean;
  userMessage: string;
}

export class DocumentAnalysisError extends Error {
  public readonly type: AnalysisError['type'];
  public readonly code: string;
  public readonly recoverable: boolean;
  public readonly userMessage: string;

  constructor(error: AnalysisError) {
    super(error.message);
    this.type = error.type;
    this.code = error.code;
    this.recoverable = error.recoverable;
    this.userMessage = error.userMessage;
    this.name = 'DocumentAnalysisError';
  }
}

export function createAnalysisError(
  type: AnalysisError['type'],
  message: string,
  code: string,
  userMessage: string,
  recoverable: boolean = false
): DocumentAnalysisError {
  return new DocumentAnalysisError({
    type,
    message,
    code,
    recoverable,
    userMessage
  });
}

export function handleApiError(error: any): DocumentAnalysisError {
  if (error.message?.includes('QUOTA_EXCEEDED')) {
    return createAnalysisError(
      'api',
      'Gemini API quota exceeded',
      'QUOTA_EXCEEDED',
      'Our AI service is temporarily at capacity. Please try again in a few minutes or contact support.',
      true
    );
  }
  
  if (error.message?.includes('INVALID_API_KEY')) {
    return createAnalysisError(
      'api',
      'Invalid Gemini API key',
      'INVALID_API_KEY',
      'There is a configuration issue with our AI service. Please contact support.',
      false
    );
  }
  
  if (error.message?.includes('timeout')) {
    return createAnalysisError(
      'api',
      'Request timeout',
      'TIMEOUT',
      'The document is too large or complex to process. Please try with a smaller document or break it into sections.',
      true
    );
  }
  
  return createAnalysisError(
    'api',
    error.message || 'Unknown API error',
    'API_ERROR',
    'An unexpected error occurred while processing your document. Please try again or contact support.',
    true
  );
}

export function handleProcessingError(error: any, fileName: string): DocumentAnalysisError {
  if (error.message?.includes('binary')) {
    return createAnalysisError(
      'processing',
      'Binary content detected',
      'BINARY_CONTENT',
      `The file "${fileName}" appears to contain images or binary data that cannot be processed. Please ensure it contains readable text.`,
      false
    );
  }
  
  if (error.message?.includes('insufficient text')) {
    return createAnalysisError(
      'processing',
      'Insufficient text content',
      'INSUFFICIENT_TEXT',
      `The file "${fileName}" does not contain enough readable text for analysis. Please check the document content.`,
      false
    );
  }
  
  return createAnalysisError(
    'processing',
    error.message || 'Processing error',
    'PROCESSING_ERROR',
    `We encountered an issue processing "${fileName}". Please try a different file format or contact support.`,
    true
  );
}

export function generateSuccessfulSummary(content: string, fileName: string, analysisType: string): string {
  const timestamp = new Date().toLocaleDateString();
  const header = `📄 **Professional Document Analysis**\n**Document:** ${fileName}\n**Analysis Date:** ${timestamp}\n**Analysis Type:** ${analysisType}\n\n---\n\n`;
  
  // Ensure the content is properly formatted
  let formattedContent = content;
  
  // Add structure if missing
  if (!content.includes('**') && !content.includes('#')) {
    formattedContent = `**Executive Summary:**\n\n${content}`;
  }
  
  // Add professional footer
  const footer = `\n\n---\n\n✅ **Analysis Complete** | Powered by LegalBriefAI Advanced Analytics | ${timestamp}`;
  
  return header + formattedContent + footer;
}
