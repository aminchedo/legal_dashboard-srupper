"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_config_1 = require("./queue.config");
const scrape_processor_1 = __importDefault(require("./processors/scrape.processor"));
const logger_1 = require("../utils/logger");
queue_config_1.scrapingQueue.process('scrape', scrape_processor_1.default);
queue_config_1.scrapingQueue.process('ocr_job', scrape_processor_1.default);
queue_config_1.notificationQueue.process(async (job) => {
    try {
        logger_1.logger.info(`Processing notification job ${job.id}`);
        return { processed: true };
    }
    catch (error) {
        logger_1.logger.error(`Notification job ${job.id} failed`, error);
        throw error;
    }
});
queue_config_1.scrapingQueue.on('error', (error) => {
    logger_1.logger.error('Scraping queue error:', error);
});
queue_config_1.notificationQueue.on('error', (error) => {
    logger_1.logger.error('Notification queue error:', error);
});
queue_config_1.scrapingQueue.on('completed', (job) => {
    logger_1.logger.info(`Job ${job.id} completed successfully`);
});
queue_config_1.scrapingQueue.on('stalled', (job) => {
    logger_1.logger.warn(`Job ${job.id} stalled`);
});
queue_config_1.scrapingQueue.on('active', (job) => {
    logger_1.logger.info(`Job ${job.id} has started`);
});
//# sourceMappingURL=worker.js.map