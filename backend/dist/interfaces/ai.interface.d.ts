export interface AiAnalysis {
    id: string;
    documentId: string;
    type: 'sentiment' | 'entity' | 'category' | 'summary';
    result: any;
    confidence: number;
    created_at: string;
}
