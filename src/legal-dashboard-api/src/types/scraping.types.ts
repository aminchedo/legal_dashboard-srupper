export interface ScrapeJob {
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
}


