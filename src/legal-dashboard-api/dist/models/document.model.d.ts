export interface DocumentRecord {
    id: string;
    title: string;
    content: string;
    category?: string | null;
    source?: string | null;
    score?: number | null;
    status: 'draft' | 'published' | 'archived';
    language?: string | null;
    keywords: string[];
    metadata: Record<string, any>;
    version: number;
    hash: string;
    created_at: string;
    updated_at?: string | null;
    published_at?: string | null;
    archived_at?: string | null;
    created_by: string;
    updated_by?: string | null;
}
export interface DocumentVersion {
    id: string;
    document_id: string;
    version: number;
    title: string;
    content: string;
    metadata: Record<string, any>;
    hash: string;
    created_at: string;
    created_by: string;
    change_summary?: string | null;
}
export interface DocumentSearch {
    id: string;
    document_id: string;
    title: string;
    content: string;
    keywords: string;
    category?: string | null;
    source?: string | null;
    language?: string | null;
    indexed_at: string;
}
export interface DocumentRating {
    id: string;
    document_id: string;
    user_id: string;
    score: number;
    feedback?: string | null;
    created_at: string;
    updated_at?: string | null;
}
export interface DocumentTag {
    id: string;
    name: string;
    color?: string | null;
    created_at: string;
}
export interface DocumentTagRelation {
    document_id: string;
    tag_id: string;
    created_at: string;
    created_by: string;
}
