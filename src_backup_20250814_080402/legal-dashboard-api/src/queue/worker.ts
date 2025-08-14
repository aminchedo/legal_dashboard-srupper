import { scrapingQueue, notificationQueue } from './queue.config';
import scrapeProcessor from './processors/scrape.processor';
import { logger } from '@utils/logger';

// Process scrape and OCR jobs using the same processor
scrapingQueue.process('scrape', scrapeProcessor);
scrapingQueue.process('ocr_job', scrapeProcessor);

// Set up notification queue for future expansion
notificationQueue.process(async (job) => {
  try {
    logger.info(`Processing notification job ${job.id}`);
    
    // Future implementation will handle different notification types
    // Such as email, push, or in-app notifications
    
    return { processed: true };
  } catch (error) {
    logger.error(`Notification job ${job.id} failed`, error);
    throw error;
  }
});

// Set up global error handler for queues
scrapingQueue.on('error', (error) => {
  logger.error('Scraping queue error:', error);
});

notificationQueue.on('error', (error) => {
  logger.error('Notification queue error:', error);
});

// Log job completion
scrapingQueue.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

// Log stalled jobs
scrapingQueue.on('stalled', (job) => {
  logger.warn(`Job ${job.id} stalled`);
});

// Log when jobs are active
scrapingQueue.on('active', (job) => {
  logger.info(`Job ${job.id} has started`);
});


