import Bull from 'bull';

export const scrapingQueue = new Bull('scraping');
export const notificationQueue = new Bull('notification');


