
/**
 * Knowledge base for AI chatbot to answer questions about analyzed documents
 */
export class ChatKnowledgeBase {
  private static instance: ChatKnowledgeBase;
  private documentStore: Map<string, any> = new Map();
  
  static getInstance(): ChatKnowledgeBase {
    if (!ChatKnowledgeBase.instance) {
      ChatKnowledgeBase.instance = new ChatKnowledgeBase();
    }
    return ChatKnowledgeBase.instance;
  }
  
  /**
   * Store document analysis for later retrieval
   */
  storeDocument(userId: string, documentId: string, analysis: any) {
    const key = `${userId}_${documentId}`;
    this.documentStore.set(key, {
      ...analysis,
      indexed_at: new Date().toISOString()
    });
    console.log(`Stored document ${documentId} for user ${userId}`);
  }
  
  /**
   * Retrieve user's recent documents
   */
  getUserDocuments(userId: string): any[] {
    const userDocs = [];
    for (const [key, doc] of this.documentStore.entries()) {
      if (key.startsWith(`${userId}_`)) {
        userDocs.push(doc);
      }
    }
    return userDocs.sort((a, b) => new Date(b.indexed_at).getTime() - new Date(a.indexed_at).getTime());
  }
  
  /**
   * Search for relevant information based on query
   */
  searchDocuments(userId: string, query: string): any[] {
    const userDocs = this.getUserDocuments(userId);
    const queryLower = query.toLowerCase();
    
    return userDocs.filter(doc => {
      const searchText = `${doc.original_name} ${doc.summary}`.toLowerCase();
      return searchText.includes(queryLower) ||
             queryLower.split(' ').some(term => searchText.includes(term));
    });
  }
  
  /**
   * Get legal knowledge for general questions
   */
  getLegalKnowledge(topic: string): string {
    const legalTopics = {
      'contract': 'Contracts are legally binding agreements between parties. Key elements include offer, acceptance, consideration, and legal capacity. Important clauses to review include termination, liability, indemnification, and governing law.',
      'liability': 'Liability refers to legal responsibility for damages or obligations. Common types include contractual liability, tort liability, and statutory liability. Limitation of liability clauses can help reduce exposure.',
      'compliance': 'Legal compliance involves adhering to applicable laws, regulations, and standards. This includes regulatory requirements, industry standards, and contractual obligations. Non-compliance can result in penalties, lawsuits, and reputational damage.',
      'intellectual property': 'Intellectual property includes patents, trademarks, copyrights, and trade secrets. Protection strategies include registration, licensing agreements, and confidentiality provisions.',
      'employment law': 'Employment law governs the relationship between employers and employees. Key areas include hiring practices, workplace safety, discrimination, wages, and termination procedures.',
      'corporate law': 'Corporate law deals with business entities, governance, securities, mergers and acquisitions, and regulatory compliance. Key documents include articles of incorporation, bylaws, and shareholder agreements.'
    };
    
    const topicLower = topic.toLowerCase();
    for (const [key, knowledge] of Object.entries(legalTopics)) {
      if (topicLower.includes(key)) {
        return knowledge;
      }
    }
    
    return 'I can help with various legal topics including contracts, liability, compliance, intellectual property, employment law, and corporate law. Please provide more specific details about your question.';
  }
}
