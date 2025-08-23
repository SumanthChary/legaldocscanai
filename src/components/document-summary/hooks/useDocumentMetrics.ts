import { useMemo } from "react";

export interface DocumentMetrics {
  wordCount: number;
  readingTime: number;
  complexityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  keyTermsCount: number;
  sentimentScore: number;
  documentType: 'contract' | 'legal' | 'business' | 'technical' | 'other';
  clausesCount: number;
  readabilityScore: number;
}

export const useDocumentMetrics = (summary: string, fileName: string): DocumentMetrics => {
  return useMemo(() => {
    const words = summary.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute
    
    // Calculate complexity based on sentence structure, legal terms, etc.
    const avgWordsPerSentence = words / (summary.split(/[.!?]+/).length - 1 || 1);
    const legalTerms = (summary.match(/\b(contract|agreement|clause|liability|indemnity|whereas|therefore|covenant|obligation|breach|remedy|jurisdiction|arbitration|damages|warranty|representation|consideration|force majeure)\b/gi) || []).length;
    
    const complexityScore = Math.min(100, Math.round((avgWordsPerSentence / 20) * 30 + (legalTerms / words) * 1000 + 30));
    
    // Risk assessment based on keywords and context
    const riskKeywords = (summary.match(/\b(risk|danger|liability|penalty|breach|violation|termination|default|dispute|litigation|lawsuit|claim|damage|loss|void|invalid|illegal|unauthorized|prohibited)\b/gi) || []).length;
    const riskScore = Math.min(100, Math.round((riskKeywords / words) * 1000 + 10));
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (riskScore >= 70) riskLevel = 'high';
    else if (riskScore >= 40) riskLevel = 'medium';
    
    // Document type detection
    let documentType: DocumentMetrics['documentType'] = 'other';
    if (summary.toLowerCase().includes('contract') || summary.toLowerCase().includes('agreement')) {
      documentType = 'contract';
    } else if (legalTerms > 5) {
      documentType = 'legal';
    } else if (summary.toLowerCase().includes('business') || summary.toLowerCase().includes('company')) {
      documentType = 'business';
    } else if (summary.toLowerCase().includes('technical') || summary.toLowerCase().includes('specification')) {
      documentType = 'technical';
    }
    
    // Sentiment analysis (simplified)
    const positiveWords = (summary.match(/\b(good|excellent|benefit|advantage|opportunity|success|effective|efficient|valuable|important|significant|positive|strong|robust|comprehensive|thorough)\b/gi) || []).length;
    const negativeWords = (summary.match(/\b(bad|poor|risk|problem|issue|concern|weakness|limitation|disadvantage|failure|ineffective|insufficient|inadequate|negative|weak|problematic)\b/gi) || []).length;
    const sentimentScore = Math.max(0, Math.min(100, 50 + ((positiveWords - negativeWords) / words) * 1000));
    
    // Count clauses (numbered items, bullet points)
    const clausesCount = (summary.match(/^\s*\d+\./gm) || []).length + (summary.match(/^\s*[-•*]/gm) || []).length;
    
    // Readability score (simplified Flesch formula)
    const sentences = summary.split(/[.!?]+/).length - 1 || 1;
    const syllables = summary.split(/[aeiouAEIOU]/).length - 1 || 1;
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))));
    
    return {
      wordCount: words,
      readingTime,
      complexityScore,
      riskLevel,
      riskScore,
      keyTermsCount: legalTerms,
      sentimentScore,
      documentType,
      clausesCount,
      readabilityScore
    };
  }, [summary, fileName]);
};