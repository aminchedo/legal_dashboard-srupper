interface AnalyticsMetric {
    id: string;
    name: string;
    value: number;
    period: 'day' | 'week' | 'month' | 'year' | 'all';
    dimension?: string | null;
    created_at: string;
}
interface DocumentSentiment {
    documentId: string;
    score: number;
    confidence: number;
    analyzed_at: string;
}
interface EntityExtraction {
    documentId: string;
    entity: string;
    type: string;
    count: number;
    confidence: number;
    analyzed_at: string;
}
interface DocumentSimilarity {
    document1Id: string;
    document2Id: string;
    similarity: number;
    created_at: string;
}
interface CategoryPrediction {
    documentId: string;
    category: string;
    confidence: number;
    analyzed_at: string;
}
interface TopicModel {
    id: string;
    name: string;
    created_at: string;
    topics: {
        id: string;
        name: string;
        keywords: string[];
        weight: number;
    }[];
}
declare class AnalyticsService {
    private db;
    getDashboardMetrics(period?: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsMetric[]>;
    calculateSentiment(documentId: string): Promise<DocumentSentiment | null>;
    extractEntities(documentId: string): Promise<EntityExtraction[]>;
    calculateDocumentSimilarity(document1Id: string, document2Id: string): Promise<DocumentSimilarity | null>;
    predictCategory(documentId: string): Promise<CategoryPrediction | null>;
    generateTopics(name: string, documentIds: string[]): Promise<TopicModel | null>;
    analyzeDocument(documentId: string): Promise<{
        sentiment: DocumentSentiment | null;
        entities: EntityExtraction[];
        category: CategoryPrediction | null;
    }>;
}
export declare const analyticsService: AnalyticsService;
export {};
