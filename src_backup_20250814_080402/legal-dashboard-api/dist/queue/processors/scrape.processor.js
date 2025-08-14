"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const scraping_service_1 = require("../../services/scraping.service");
const ocr_service_1 = require("../../services/ocr.service");
const logger_1 = require("../../utils/logger");
const websocket_controller_1 = require("../../controllers/websocket.controller");
async function default_1(job) {
    try {
        logger_1.logger.info(`Processing job ${job.id} of type ${job.name}`);
        (0, websocket_controller_1.emitSystemEvent)('job_started', {
            jobId: job.id,
            type: job.name,
            data: job.data
        });
        if (job.name === 'scrape') {
            return await processScrapeJob(job.data);
        }
        else if (job.name === 'ocr_job') {
            return await processOcrJob(job.data);
        }
        else {
            throw new Error(`Unknown job type: ${job.name}`);
        }
    }
    catch (error) {
        logger_1.logger.error(`Job ${job.id} failed`, error);
        (0, websocket_controller_1.emitSystemEvent)('job_failed', {
            jobId: job.id,
            type: job.name,
            error: error.message
        });
        throw error;
    }
}
async function processScrapeJob(data) {
    const { jobId, url, sourceId, depth = 1, filters = {}, userId } = data;
    await scraping_service_1.scrapingService.updateJobStatus(jobId, 'running', 0);
    (0, websocket_controller_1.emitSystemEvent)('scraping_update', {
        jobId,
        status: 'running',
        progress: 0,
        url
    });
    try {
        const result = await scraping_service_1.scrapingService.scrapeUrl(url, sourceId, depth, filters, userId, (progress) => {
            scraping_service_1.scrapingService.updateJobProgress(jobId, progress);
            (0, websocket_controller_1.emitSystemEvent)('scraping_update', {
                jobId,
                status: 'running',
                progress,
                url
            });
        });
        await scraping_service_1.scrapingService.updateJobStatus(jobId, 'completed', 100);
        (0, websocket_controller_1.emitSystemEvent)('scraping_update', {
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
    }
    catch (error) {
        await scraping_service_1.scrapingService.updateJobStatus(jobId, 'failed', 0);
        (0, websocket_controller_1.emitSystemEvent)('scraping_update', {
            jobId,
            status: 'failed',
            error: error.message,
            url
        });
        throw error;
    }
}
async function processOcrJob(data) {
    const { jobId, filePath, language, userId } = data;
    try {
        const result = await ocr_service_1.ocrService.processFile({
            filePath,
            language
        }, userId);
        (0, websocket_controller_1.emitSystemEvent)('ocr_update', {
            jobId,
            status: 'completed',
            progress: 100,
            filePath,
            confidence: result.confidence
        });
        return result;
    }
    catch (error) {
        (0, websocket_controller_1.emitSystemEvent)('ocr_update', {
            jobId,
            status: 'failed',
            error: error.message,
            filePath
        });
        throw error;
    }
}
//# sourceMappingURL=scrape.processor.js.map