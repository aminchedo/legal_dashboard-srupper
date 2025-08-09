export interface DocumentRecordRaw {
    id: string;
    title: string;
    content: string;
    category?: string | null;
    source?: string | null;
    score?: number | null;
    status: 'draft' | 'published' | 'archived';
    language?: string | null;
    keywords: string;
    metadata: string;
    version: number;
    hash: string;
    created_at: string;
    updated_at?: string | null;
    created_by: string;
}
export interface DocumentVersionRaw {
    id: string;
    document_id: string;
    version: number;
    title: string;
    content: string;
    metadata: string;
    hash: string;
    created_at: string;
    created_by: string;
    change_summary?: string | null;
}
