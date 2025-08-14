export interface WebSocketData {
  [key: string]: unknown;
}

export interface DocumentUpdateData {
  documentId: string;
  changes: Record<string, unknown>;
  version: number;
}

export interface ScrapingProgressData {
  jobId: string;
  progress: number;
  status: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DocumentEventData {
  type: 'document_updated' | 'document_created' | 'document_deleted';
  documentId: string;
  userId?: string;
  data?: Record<string, unknown>;
}

export interface ScrapingEventData {
  type: 'scraping_started' | 'scraping_completed' | 'scraping_failed' | 'scraping_progress';
  jobId: string;
  progress?: number;
  data?: Record<string, unknown>;
}

export type SocketEventData = DocumentEventData | ScrapingEventData | WebSocketData;


