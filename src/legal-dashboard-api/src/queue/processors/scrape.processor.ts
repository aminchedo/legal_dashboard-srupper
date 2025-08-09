import { Job } from 'bull';
import { scrapingService } from '@services/scraping.service';
import { ocrService } from '@services/ocr.service';
import { logger } from '@utils/logger';
import { emitSystemEvent } from '@controllers/websocket.controller';

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

/**
 * Process scraping jobs from the queue
 */
export default async function (job: Job<ScrapeJob | OcrJob>): Promise<any> {
    try {
        logger.info(`Processing job ${job.id} of type ${job.name}`);

        // Emit event for job started
        emitSystemEvent('job_started', {
            jobId: job.id,
            type: job.name,
            data: job.data
        });

        // Handle different job types
        if (job.name === 'scrape') {
            return await processScrapeJob(job.data as ScrapeJob);
        } else if (job.name === 'ocr_job') {
            return await processOcrJob(job.data as OcrJob);
        } else {
            throw new Error(`Unknown job type: ${job.name}`);
        }
    } catch (error) {
        logger.error(`Job ${job.id} failed`, error);

        // Emit event for job failure
        emitSystemEvent('job_failed', {
            jobId: job.id,
            type: job.name,
            error: (error as Error).message
        });

        throw error;
    }
}

/**
 * Process a web scraping job
 */
async function processScrapeJob(data: ScrapeJob): Promise<any> {
    const { jobId, url, sourceId, depth = 1, filters = {}, userId } = data;

    // Update job status to running
    await scrapingService.updateJobStatus(jobId, 'running', 0);

    // Emit progress event
    emitSystemEvent('scraping_update', {
        jobId,
        status: 'running',
        progress: 0,
        url
    });

    try {
        // Start scraping process
        const result = await scrapingService.scrapeUrl(
            url,
            sourceId,
            depth,
            filters,
            userId,
            (progress) => {
                // Update progress in DB
                scrapingService.updateJobProgress(jobId, progress);

                // Emit progress event
                emitSystemEvent('scraping_update', {
                    jobId,
                    status: 'running',
                    progress,
                    url
                });
            }
        );

        // Update job as completed
        await scrapingService.updateJobStatus(jobId, 'completed', 100);

        // Emit completion event
        emitSystemEvent('scraping_update', {
            jobId,
            status: 'completed',
            progress: 100,
            url,
            stats: {
                documentsCreated: result.documentsCreated,
                pagesProcessed: result.pagesProcessed,
                bytesProcessed: result.bytesProcessed
            }
        });

        return result;
    } catch (error) {
        // Update job as failed
        await scrapingService.updateJobStatus(jobId, 'failed', 0);

        // Emit failure event
        emitSystemEvent('scraping_update', {
            jobId,
            status: 'failed',
            error: (error as Error).message,
            url
        });

        throw error;
    }
}

/**
 * Process an OCR job
 */
async function processOcrJob(data: OcrJob): Promise<any> {
    const { jobId, filePath, language, userId } = data;

    try {
        // Process the OCR
        const result = await ocrService.processFile({
            filePath,
            language
        }, userId);

        // Emit completion event
        emitSystemEvent('ocr_update', {
            jobId,
            status: 'completed',
            progress: 100,
            filePath,
            confidence: result.confidence
        });

        return result;
    } catch (error) {
        // Emit failure event
        emitSystemEvent('ocr_update', {
            jobId,
            status: 'failed',
            error: (error as Error).message,
            filePath
        });

        throw error;
    }
}