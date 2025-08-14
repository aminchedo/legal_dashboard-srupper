export interface DocumentItem {
    id: string;
    title: string;
    content: string;
    category?: string;
    source?: string;
    score?: number;
    createdAt: string;
    updatedAt?: string;
}
