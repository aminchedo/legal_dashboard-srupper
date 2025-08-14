import { DocumentRecord, DocumentVersion } from '../models/document.model';
declare class DocumentService {
    private db;
    createDocument(data: Partial<DocumentRecord>, userId: string): Promise<DocumentRecord>;
    getDocumentById(id: string): Promise<DocumentRecord | null>;
    updateDocument(id: string, data: Partial<DocumentRecord>, userId: string): Promise<DocumentRecord | null>;
    deleteDocument(id: string): Promise<boolean>;
    listDocuments(options: {
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
        source?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        items: DocumentRecord[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    searchDocuments(query: string, options?: {
        page?: number;
        limit?: number;
        highlightStart?: string;
        highlightEnd?: string;
        status?: string;
    }): Promise<{
        results: Array<DocumentRecord & {
            snippet: string;
            rank: number;
        }>;
        total: number;
        page: number;
        pageCount: number;
    }>;
    getDocumentVersions(documentId: string): Promise<DocumentVersion[]>;
    getDocumentVersion(documentId: string, version: number): Promise<DocumentVersion | null>;
    revertToVersion(documentId: string, version: number, userId: string): Promise<DocumentRecord | null>;
    getCategories(): Promise<string[]>;
    getSources(): Promise<string[]>;
    getStatistics(): Promise<any>;
    getTags(): Promise<string[]>;
    private generateContentHash;
}
export declare const documentService: DocumentService;
export {};
