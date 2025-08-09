export interface ScrapeJobRecord {
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    created_at: string;
    updated_at?: string | null;
}
