export interface DocumentRecordRaw {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  source?: string | null;
  score?: number | null;
  status: 'draft' | 'published' | 'archived';
  language?: string | null;
  keywords: string; // JSON string in database
  metadata: string; // JSON string in database
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
  metadata: string; // JSON string in database
  hash: string;
  created_at: string;
  created_by: string;
  change_summary?: string | null;
}

export interface DatabaseTransaction {
  query<T = unknown>(sql: string, params?: unknown[]): T[];
  run(sql: string, params?: unknown[]): { changes: number; lastInsertRowid: number };
  begin(): void;
  commit(): void;
  rollback(): void;
}

export interface DatabaseClient {
  query<T = unknown>(sql: string, params?: unknown[]): T[];
  run(sql: string, params?: unknown[]): { changes: number; lastInsertRowid: number };
  transaction<T>(callback: (tx: DatabaseTransaction) => T): T;
  close(): void;
}