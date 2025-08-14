// Recording Component Types
export interface ScrapingJob {
  id: string;
  url: string;
  source_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: {
    documentsCreated: number;
    pagesProcessed: number;
    bytesProcessed: number;
  };
  error?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  created_by: string;
}

export interface ScrapingSource {
  id: string;
  name: string;
  base_url: string;
  url?: string;
  category?: string;
  priority?: number;
  status?: string;
  selectors: {
    content: string;
    title?: string;
    date?: string;
    category?: string;
    next_page?: string;
  };
  headers?: Record<string, string>;
  created_at: string;
  updated_at?: string;
}

export interface ScrapingLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  source?: string;
  jobId?: string;
}

export interface ScrapingSettings {
  maxPages: number;
  delay: number;
  minContentLength: number;
  enableRating: boolean;
  intelligentMode: boolean;
  useProxies: boolean;
  parallelJobs: number;
  contentFilter: string[];
  language: 'fa' | 'en' | 'auto';
  depth: number;
  userAgent: string;
}

export interface SystemHealth {
  status: string;
  queue: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  perSource: Array<{
    source: string;
    count: number;
  }>;
  uptime: number;
}

export interface CreateSourceForm {
  name: string;
  base_url: string;
  category: string;
  priority: number;
  status: string;
  selectors: {
    content: string;
    title: string;
    date: string;
    category: string;
    next_page: string;
  };
  headers: Record<string, string>;
}