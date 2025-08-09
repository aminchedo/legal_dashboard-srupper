interface ScrapingSource {
    id: string;
    name: string;
    base_url: string;
    selectors: {
        content: string;
        title?: string;
        date?: string;
        category?: string;
        next_page?: string;
    };
    headers?: Record<string, string>;
    created_at: string;
    updated_at?: string | null;
}
interface ScrapingJobRecord {
    id: string;
    url: string;
    source_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    result?: any;
    error?: string | null;
    created_at: string;
    updated_at?: string | null;
    completed_at?: string | null;
    created_by: string;
}
declare class ScrapingService {
    private db;
    private defaultUserAgents;
    private pickUserAgent;
    createJob(url: string, sourceId: string, userId: string, options?: {
        depth?: number;
        filters?: {
            contentTypes?: string[];
            dateRange?: {
                start?: string;
                end?: string;
            };
            keywords?: string[];
        };
    }): Promise<string>;
    getJob(jobId: string): Promise<ScrapingJobRecord | null>;
    updateJobStatus(jobId: string, status: 'pending' | 'running' | 'completed' | 'failed', progress: number): Promise<void>;
    updateJobProgress(jobId: string, progress: number): Promise<void>;
    listJobs(options?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        items: ScrapingJobRecord[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    listSources(): Promise<(ScrapingSource & {
        url?: string;
        category?: string;
        priority?: number;
        status?: string;
    })[]>;
    createSource(input: {
        name: string;
        base_url: string;
        url?: string;
        category?: string;
        priority?: number;
        status?: string;
        selectors: ScrapingSource['selectors'];
        headers?: Record<string, string>;
    }): Promise<ScrapingSource & {
        url?: string;
        category?: string;
        priority?: number;
        status?: string;
    }>;
    getSource(sourceId: string): Promise<ScrapingSource | null>;
    scrapeUrl(url: string, sourceId: string, depth: number | undefined, filters: {} | undefined, userId: string, progressCallback?: (progress: number) => void): Promise<{
        documentsCreated: number;
        pagesProcessed: number;
        bytesProcessed: number;
    }>;
    scrapeWithIntelligence(sourceId: string, userId: string, options?: any): Promise<{
        success: boolean;
        documents: {
            url?: string;
            title?: string;
            content?: string;
            source?: string;
            method?: string;
        }[];
        method: string;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        method: string;
        documents?: undefined;
        message?: undefined;
    } | {
        documentsCreated: number;
        pagesProcessed: number;
        bytesProcessed: number;
        success: boolean;
    }>;
    private shouldTryDirectFirst;
    private attemptDirectScraping;
}
export declare const scrapingService: ScrapingService;
export {};
