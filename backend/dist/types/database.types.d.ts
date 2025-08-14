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
export interface DatabaseTransaction {
    query<T = unknown>(sql: string, params?: unknown[]): T[];
    run(sql: string, params?: unknown[]): {
        changes: number;
        lastInsertRowid: number;
    };
    begin(): void;
    commit(): void;
    rollback(): void;
}
export interface PreparedStatement {
    get(params?: unknown[]): any;
    all(params?: unknown[]): any[];
    run(params?: unknown[]): {
        changes: number;
        lastInsertRowid: number;
    };
}
export interface DatabaseClient {
    query<T = unknown>(sql: string, params?: unknown[]): T[];
    run(sql: string, params?: unknown[]): {
        changes: number;
        lastInsertRowid: number;
    };
    prepare(sql: string): PreparedStatement;
    transaction<T>(callback?: (tx: DatabaseTransaction) => T): T | DatabaseTransaction;
    close(): void;
}
