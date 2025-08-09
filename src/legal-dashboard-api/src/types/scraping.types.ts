export interface ScrapingResult {
  documentsCreated: number;
  pagesProcessed: number;
  bytesProcessed: number;
  documents?: Array<{
    id: string;
    title: string;
    content: string;
    url: string;
  }>;
  errors?: string[];
}

export interface ScrapingJobData {
  [key: string]: unknown;
}

export interface ScrapingElement {
  [key: string]: unknown;
}

export interface ScrapingSelector {
  content?: string;
  title?: string;
  date?: string;
  next_page?: string;
}

export interface ScrapingHeaders {
  [key: string]: string;
}

export interface ProxyChain {
  [key: string]: unknown;
}

export interface ScrapingSourceRaw {
  id: string;
  name: string;
  base_url: string;
  selectors: string;
  headers: string | null;
  created_at: string;
  updated_at: string | null;
  url?: string;
  category?: string;
  priority?: number;
  status?: string;
}


