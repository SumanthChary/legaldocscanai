
/**
 * In-memory knowledge base for chat functionality
 */
export class ChatKnowledgeBase {
  private static instance: ChatKnowledgeBase;
  private documents: Map<string, Map<string, any>> = new Map();

  private constructor() {}

  public static getInstance(): ChatKnowledgeBase {
    if (!ChatKnowledgeBase.instance) {
      ChatKnowledgeBase.instance = new ChatKnowledgeBase();
    }
    return ChatKnowledgeBase.instance;
  }

  public storeDocument(userId: string, documentId: string, documentData: any): void {
    if (!this.documents.has(userId)) {
      this.documents.set(userId, new Map());
    }
    
    const userDocs = this.documents.get(userId);
    if (userDocs) {
      userDocs.set(documentId, documentData);
      console.log(`📚 Stored document ${documentId} for user ${userId} in knowledge base`);
    }
  }

  public getDocument(userId: string, documentId: string): any | null {
    const userDocs = this.documents.get(userId);
    return userDocs?.get(documentId) || null;
  }

  public getUserDocuments(userId: string): any[] {
    const userDocs = this.documents.get(userId);
    return userDocs ? Array.from(userDocs.values()) : [];
  }

  public removeDocument(userId: string, documentId: string): boolean {
    const userDocs = this.documents.get(userId);
    if (userDocs) {
      return userDocs.delete(documentId);
    }
    return false;
  }
}
