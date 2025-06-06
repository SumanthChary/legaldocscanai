
export function generateEmergencySummary(text: string, fileName: string): string {
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

export function formatUltraFastResult(summary: string, fileName: string, fileType: string, processingTime: number): string {
  const timestamp = new Date().toLocaleDateString();
  
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
