"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
exports.status = status;
exports.statusById = statusById;
exports.sources = sources;
exports.createSource = createSource;
exports.stopById = stopById;
exports.stopAll = stopAll;
exports.health = health;
exports.rotate = rotate;
const scraping_service_1 = require("@services/scraping.service");
const logger_1 = require("@utils/logger");
const queue_config_1 = require("@queue/queue.config");
const database_service_1 = require("@services/database.service");
async function start(req, res) {
    try {
        const { url, sourceId, depth, filters } = req.body;
        if (!url || !sourceId) {
            return res.status(400).json({
                error: 'URL and sourceId are required'
            });
        }
        const userId = req.user?.id || 'system';
        const jobId = await scraping_service_1.scrapingService.createJob(url, sourceId, userId, { depth, filters });
        return res.status(201).json({ jobId });
    }
    catch (error) {
        logger_1.logger.error('Failed to start scraping job', error);
        return res.status(500).json({
            error: 'Failed to start scraping job',
            details: error.message
        });
    }
}
async function status(req, res) {
    try {
        const { page = '1', limit = '20', status: jobStatus } = req.query;
        const result = await scraping_service_1.scrapingService.listJobs({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            status: jobStatus
        });
        return res.json({
            jobs: result.items,
            pagination: {
                total: result.total,
                page: result.page,
                pageCount: result.pageCount
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to list scraping jobs', error);
        return res.status(500).json({
            error: 'Failed to list scraping jobs',
            details: error.message
        });
    }
}
async function statusById(req, res) {
    try {
        const { id } = req.params;
        const job = await scraping_service_1.scrapingService.getJob(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        return res.json(job);
    }
    catch (error) {
        logger_1.logger.error('Failed to get job status', error);
        return res.status(500).json({
            error: 'Failed to get job status',
            details: error.message
        });
    }
}
async function sources(req, res) {
    try {
        const sources = await scraping_service_1.scrapingService.listSources();
        return res.json({ sources, count: sources.length });
    }
    catch (error) {
        logger_1.logger.error('Failed to list scraping sources', error);
        return res.status(500).json({
            error: 'Failed to list scraping sources',
            details: error.message
        });
    }
}
async function createSource(req, res) {
    try {
        const { name, baseUrl, url, category, priority, status, selectors, headers } = req.body;
        if (!name || !baseUrl || !selectors || !selectors.content) {
            return res.status(400).json({
                error: 'Name, baseUrl, and selectors.content are required'
            });
        }
        const source = await scraping_service_1.scrapingService.createSource({
            name,
            base_url: baseUrl,
            url,
            category,
            priority,
            status,
            selectors,
            headers
        });
        return res.status(201).json(source);
    }
    catch (error) {
        logger_1.logger.error('Failed to create scraping source', error);
        return res.status(500).json({
            error: 'Failed to create scraping source',
            details: error.message
        });
    }
}
async function stopById(req, res) {
    try {
        const { id } = req.params;
        const job = await scraping_service_1.scrapingService.getJob(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.status === 'pending') {
            const jobs = await queue_config_1.scrapingQueue.getJobs(['waiting', 'delayed', 'paused']);
            const bullJob = jobs.find(j => j.data && j.data.jobId === id);
            if (bullJob) {
                await bullJob.remove();
            }
        }
        await scraping_service_1.scrapingService.updateJobStatus(id, 'failed', job.progress);
        return res.json({
            id,
            stopped: true,
            previousStatus: job.status
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to stop job', error);
        return res.status(500).json({
            error: 'Failed to stop job',
            details: error.message
        });
    }
}
async function stopAll(req, res) {
    try {
        await queue_config_1.scrapingQueue.clean(0, 'wait');
        await queue_config_1.scrapingQueue.clean(0, 'active');
        await queue_config_1.scrapingQueue.clean(0, 'delayed');
        const result = await scraping_service_1.scrapingService.listJobs({
            limit: 1000,
            status: 'running'
        });
        const pendingResult = await scraping_service_1.scrapingService.listJobs({
            limit: 1000,
            status: 'pending'
        });
        for (const job of [...result.items, ...pendingResult.items]) {
            await scraping_service_1.scrapingService.updateJobStatus(job.id, 'failed', job.progress);
        }
        return res.json({
            stopped: true,
            count: result.items.length + pendingResult.items.length
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to stop all jobs', error);
        return res.status(500).json({
            error: 'Failed to stop all jobs',
            details: error.message
        });
    }
}
async function health(req, res) {
    try {
        const counts = await queue_config_1.scrapingQueue.getJobCounts();
        const db = database_service_1.databaseService.getClient();
        const perSource = db.query(`SELECT ds.source_id as source, COUNT(*) as count
       FROM document_source_relations ds
       GROUP BY ds.source_id`);
        return res.json({
            status: 'ok',
            queue: {
                waiting: counts.waiting,
                active: counts.active,
                completed: counts.completed,
                failed: counts.failed,
                delayed: counts.delayed
            },
            perSource,
            uptime: process.uptime()
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get health status', error);
        return res.status(500).json({
            error: 'Failed to get health status',
            details: error.message
        });
    }
}
async function rotate(req, res) {
    try {
        const userId = req.user?.id || 'system';
        const db = database_service_1.databaseService.getClient();
        const sources = db.query('SELECT id, name, url, base_url FROM scraping_sources');
        const byHost = new Map();
        for (const s of sources) {
            const url = (s.url || s.base_url);
            try {
                const host = new URL(url).hostname.replace(/^www\./, '');
                byHost.set(host, { id: s.id, name: s.name, url });
            }
            catch {
            }
        }
        const planHosts = [
            'qavanin.ir', 'rrk.ir', 'majlis.ir',
            'dolat.ir', 'dadgostari.ir', 'rc.majlis.ir',
            'shura-gc.ir', 'moj.ir'
        ];
        const jobs = [];
        for (const host of planHosts) {
            const entry = [...byHost.entries()].find(([h]) => h === host || h.endsWith(host));
            if (!entry) {
                jobs.push({ host, skipped: true });
                continue;
            }
            const [, src] = entry;
            const jobId = await scraping_service_1.scrapingService.createJob(src.url, src.id, userId, { depth: 5 });
            jobs.push({ host, jobId });
        }
        return res.json({ started: true, jobs });
    }
    catch (error) {
        logger_1.logger.error('Failed to start rotation', error);
        return res.status(500).json({ error: 'Failed to start rotation', details: error.message });
    }
}
//# sourceMappingURL=scraping.controller.js.map