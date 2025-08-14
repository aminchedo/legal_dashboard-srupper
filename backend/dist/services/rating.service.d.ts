interface DocumentRating {
    id: string;
    document_id: string;
    user_id: string;
    score: number;
    feedback?: string | null;
    created_at: string;
    updated_at?: string | null;
}
interface RatingStats {
    documentId: string;
    averageScore: number;
    totalRatings: number;
    distribution: {
        '1': number;
        '2': number;
        '3': number;
        '4': number;
        '5': number;
    };
    recentRatings: DocumentRating[];
}
declare class RatingService {
    private db;
    rateDocument(documentId: string, userId: string, score: number, feedback?: string): Promise<DocumentRating>;
    getRating(ratingId: string): Promise<DocumentRating | null>;
    getUserRating(documentId: string, userId: string): Promise<DocumentRating | null>;
    getDocumentRatings(documentId: string, options?: {
        page?: number;
        limit?: number;
    }): Promise<{
        items: DocumentRating[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    deleteRating(ratingId: string, userId: string): Promise<boolean>;
    getRatingStats(documentId: string): Promise<RatingStats | null>;
    private updateDocumentScore;
}
export declare const ratingService: RatingService;
export {};
