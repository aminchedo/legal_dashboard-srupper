import { Job } from 'bull';
interface ScrapeJob {
    jobId: string;
    url: string;
    sourceId: string;
    depth?: number;
    filters?: {
        contentTypes?: string[];
        dateRange?: {
            start?: string;
            end?: string;
        };
        keywords?: string[];
    };
    userId: string;
}
interface OcrJob {
    jobId: string;
    filePath: string;
    language?: string;
    userId: string;
}
export default function (job: Job<ScrapeJob | OcrJob>): Promise<any>;
export {};
