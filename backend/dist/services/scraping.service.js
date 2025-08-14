"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapingService = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const uuid_1 = require("uuid");
const database_service_1 = require("./database.service");
const document_service_1 = require("./document.service");
const logger_1 = require("@utils/logger");
const websocket_controller_1 = require("@controllers/websocket.controller");
const queue_config_1 = require("@queue/queue.config");
const url_1 = require("url");
const proxy_service_1 = require("./proxy.service");
class ScrapingService {
    constructor() {
        this.db = database_service_1.databaseService.getClient();
        this.defaultUserAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
        ];
    }
    pickUserAgent() {
        const idx = Math.floor(Math.random() * this.defaultUserAgents.length);
        return this.defaultUserAgents[idx];
    }
    async createJob(url, sourceId, userId, options = {}) {
        const jobId = (0, uuid_1.v4)();
        const now = new Date().toISOString();
        this.db.run(`
      INSERT INTO scraping_jobs (
        id, url, source_id, status, progress, result, error,
        created_at, updated_at, completed_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            jobId, url, sourceId, 'pending', 0, null, null,
            now, now, null, userId
        ]);
        await queue_config_1.scrapingQueue.add('scrape', {
            jobId,
            url,
            sourceId,
            depth: options.depth || 1,
            filters: options.filters,
            userId
        });
        (0, websocket_controller_1.emitSystemEvent)('scraping_job_created', {
            jobId,
            url,
            sourceId
        });
        return jobId;
    }
    async getJob(jobId) {
        try {
            const job = this.db.query(`
        SELECT * FROM scraping_jobs WHERE id = ?
      `, [jobId])[0];
            if (!job) {
                return null;
            }
            if (job.result && typeof job.result === 'string') {
                job.result = JSON.parse(job.result);
            }
            return job;
        }
        catch (error) {
            logger_1.logger.error('Failed to get scraping job', error);
            throw error;
        }
    }
    async updateJobStatus(jobId, status, progress) {
        const now = new Date().toISOString();
        const completedAt = status === 'completed' || status === 'failed' ? now : null;
        try {
            this.db.run(`
        UPDATE scraping_jobs
        SET status = ?, progress = ?, updated_at = ?,
            completed_at = ?
        WHERE id = ?
      `, [status, progress, now, completedAt, jobId]);
        }
        catch (error) {
            logger_1.logger.error('Failed to update job status', error);
            throw error;
        }
    }
    async updateJobProgress(jobId, progress) {
        const now = new Date().toISOString();
        try {
            this.db.run(`
        UPDATE scraping_jobs
        SET progress = ?, updated_at = ?
        WHERE id = ?
      `, [progress, now, jobId]);
        }
        catch (error) {
            logger_1.logger.error('Failed to update job progress', error);
            throw error;
        }
    }
    async listJobs(options = {}) {
        const { page = 1, limit = 20, status } = options;
        const offset = (page - 1) * limit;
        try {
            const whereConditions = [];
            const whereParams = [];
            if (status) {
                whereConditions.push('status = ?');
                whereParams.push(status);
            }
            const whereClause = whereConditions.length > 0
                ? `WHERE ${whereConditions.join(' AND ')}`
                : '';
            const countResult = this.db.query(`
        SELECT COUNT(*) as count FROM scraping_jobs ${whereClause}
      `, whereParams);
            const total = countResult[0].count;
            const results = this.db.query(`
        SELECT * FROM scraping_jobs
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...whereParams, limit, offset]);
            const items = results.map(job => {
                if (job.result && typeof job.result === 'string') {
                    return {
                        ...job,
                        result: JSON.parse(job.result)
                    };
                }
                return job;
            });
            return {
                items,
                total,
                page,
                pageCount: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to list scraping jobs', error);
            throw error;
        }
    }
    async listSources() {
        try {
            const results = this.db.query(`SELECT * FROM scraping_sources ORDER BY priority ASC, created_at DESC`);
            return results.map((s) => ({
                ...s,
                selectors: typeof s.selectors === 'string' ? JSON.parse(s.selectors) : s.selectors,
                headers: typeof s.headers === 'string' && s.headers ? JSON.parse(s.headers) : s.headers
            }));
        }
        catch (error) {
            logger_1.logger.error('Failed to list scraping sources', error);
            throw error;
        }
    }
    async createSource(input) {
        const id = (0, uuid_1.v4)();
        const now = new Date().toISOString();
        try {
            this.db.run(`INSERT INTO scraping_sources (id, name, base_url, url, category, priority, status, selectors, headers, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                id,
                input.name,
                input.base_url,
                input.url ?? input.base_url,
                input.category ?? null,
                input.priority ?? 2,
                input.status ?? 'active',
                JSON.stringify(input.selectors),
                input.headers ? JSON.stringify(input.headers) : null,
                now,
                null
            ]);
            return {
                id,
                name: input.name,
                base_url: input.base_url,
                url: input.url ?? input.base_url,
                category: input.category ?? undefined,
                priority: input.priority ?? 2,
                status: input.status ?? 'active',
                selectors: input.selectors,
                headers: input.headers,
                created_at: now,
                updated_at: null
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to create scraping source', error);
            throw error;
        }
    }
    async getSource(sourceId) {
        try {
            const source = this.db.query(`
        SELECT * FROM scraping_sources WHERE id = ?
      `, [sourceId])[0];
            if (!source) {
                return null;
            }
            if (source.selectors && typeof source.selectors === 'string') {
                source.selectors = JSON.parse(source.selectors);
            }
            if (source.headers && typeof source.headers === 'string') {
                source.headers = JSON.parse(source.headers);
            }
            return source;
        }
        catch (error) {
            logger_1.logger.error('Failed to get scraping source', error);
            throw error;
        }
    }
    async scrapeUrl(url, sourceId, depth = 1, _filters = {}, userId, progressCallback) {
        let source = await this.getSource(sourceId);
        if (!source) {
            const origin = (() => { try {
                return new url_1.URL(url).origin;
            }
            catch {
                return url;
            } })();
            source = {
                id: 'generic',
                name: 'Generic Source',
                base_url: origin,
                selectors: {
                    content: 'article, main, .content, #content',
                    title: 'h1, title',
                    date: 'time, .date, .publish-date',
                    next_page: 'a[rel="next"], .pagination a.next, .next a',
                },
                headers: undefined,
                created_at: new Date().toISOString(),
                updated_at: null,
            };
        }
        const proxiesEnv = process.env.SCRAPER_PROXIES || '';
        const proxies = proxiesEnv
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean);
        const rotator = new proxy_service_1.ResilientProxyRotator(proxies);
        const visited = new Set();
        let currentUrl = url;
        let pagesProcessed = 0;
        let documentsCreated = 0;
        let bytesProcessed = 0;
        const maxDepth = Math.max(1, depth);
        const fetchWithRetry = async (targetUrl, headers) => {
            const maxAttempts = Math.max(1, Math.min(5, proxies.length ? proxies.length : 3));
            let lastError = null;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const proxy = rotator.getProxy();
                const axiosConfig = {
                    method: 'GET',
                    url: targetUrl,
                    timeout: 20000,
                    validateStatus: (s) => s >= 200 && s < 400,
                    headers: {
                        'User-Agent': this.pickUserAgent(),
                        'Accept-Language': 'fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                        ...source.headers,
                        ...headers,
                    },
                };
                if (proxy) {
                    try {
                        const parsed = new url_1.URL(proxy);
                        if (parsed.hostname && parsed.port) {
                            axiosConfig.proxy = {
                                host: parsed.hostname,
                                port: Number(parsed.port),
                                protocol: parsed.protocol.replace(':', ''),
                                auth: parsed.username || parsed.password
                                    ? { username: decodeURIComponent(parsed.username), password: decodeURIComponent(parsed.password) }
                                    : undefined,
                            };
                        }
                    }
                    catch (e) {
                        logger_1.logger.warn(`Invalid proxy URL skipped: ${proxy}`);
                    }
                }
                try {
                    const res = await axios_1.default.request(axiosConfig);
                    bytesProcessed += res.data ? Buffer.byteLength(res.data, 'utf8') : 0;
                    return res.data;
                }
                catch (err) {
                    lastError = err instanceof Error ? err : new Error(String(err));
                    if (proxy)
                        rotator.blacklistProxy(proxy);
                    const delay = 500 * (attempt + 1);
                    await new Promise((r) => setTimeout(r, delay));
                }
            }
            throw lastError || new Error('Failed to fetch page');
        };
        for (let i = 0; i < maxDepth && currentUrl; i++) {
            if (visited.has(currentUrl))
                break;
            visited.add(currentUrl);
            const progress = Math.round((i / maxDepth) * 100);
            progressCallback?.(progress);
            (0, websocket_controller_1.emitSystemEvent)('scraping_update', { url: currentUrl, progress });
            const html = await fetchWithRetry(currentUrl);
            const $ = cheerio_1.default.load(html);
            const title = source.selectors.title ? $(source.selectors.title).first().text().trim() : $('title').first().text().trim();
            const contentNodes = $(source.selectors.content);
            const content = contentNodes
                .map((_idx, el) => $(el).text().trim())
                .get()
                .filter(Boolean)
                .join('\n\n');
            const dateText = source.selectors.date ? $(source.selectors.date).first().text().trim() : undefined;
            const categoryText = source.selectors.category ? $(source.selectors.category).first().text().trim() : undefined;
            if (content && content.length > 100) {
                const created = await document_service_1.documentService.createDocument({
                    title: title || currentUrl,
                    content,
                    category: categoryText || undefined,
                    source: source.name,
                    status: 'published',
                    language: 'fa',
                    metadata: {
                        url: currentUrl,
                        sourceId,
                        scrapedAt: new Date().toISOString(),
                        extractedDate: dateText,
                        baseUrl: source.base_url,
                    },
                    keywords: [],
                }, userId);
                try {
                    this.db.run(`INSERT OR REPLACE INTO document_source_relations (document_id, source_id, scrape_job_id, url, extracted_at)
             VALUES (?, ?, ?, ?, ?)`, [created.id, sourceId, null, currentUrl, new Date().toISOString()]);
                }
                catch (relationErr) {
                    logger_1.logger.warn('Failed to insert document_source_relations', relationErr);
                }
                documentsCreated += 1;
            }
            pagesProcessed += 1;
            let nextUrl = null;
            if (source.selectors.next_page) {
                const nextHref = $(source.selectors.next_page).first().attr('href');
                if (nextHref) {
                    try {
                        const absolute = new url_1.URL(nextHref, currentUrl).toString();
                        nextUrl = absolute;
                    }
                    catch {
                        nextUrl = null;
                    }
                }
            }
            currentUrl = nextUrl;
        }
        progressCallback?.(100);
        try {
            this.db.run(`UPDATE scraping_jobs SET result = ?, progress = ?, status = ?, updated_at = ?, completed_at = ? WHERE url = ? AND source_id = ?`, [
                JSON.stringify({ documentsCreated, pagesProcessed, bytesProcessed }),
                100,
                'completed',
                new Date().toISOString(),
                new Date().toISOString(),
                url,
                sourceId,
            ]);
        }
        catch (err) {
            logger_1.logger.warn('Failed to persist scraping result summary', err);
        }
        return {
            documentsCreated,
            pagesProcessed,
            bytesProcessed,
        };
    }
    async scrapeWithIntelligence(sourceId, userId, options = {}) {
        const source = await this.getSource(sourceId);
        if (!source) {
            throw new Error(`Source not found: ${sourceId}`);
        }
        let result;
        try {
            logger_1.logger.info(`🧠 Attempting intelligent scraping for: ${source.name}`);
            if (await this.shouldTryDirectFirst(source.base_url)) {
                logger_1.logger.info('🚀 Trying direct connection first...');
                result = await this.attemptDirectScraping(source, userId, options);
                if (result.success) {
                    logger_1.logger.info('✅ Direct scraping successful');
                    return result;
                }
            }
            logger_1.logger.info('🔄 Falling back to proxy scraping...');
            result = await this.scrapeUrl(source.base_url, sourceId, Number(options.depth) || 1, options.filters || {}, userId);
            return { success: true, ...result };
        }
        catch (error) {
            const { getErrorMessage } = await Promise.resolve().then(() => __importStar(require('@utils/error-handler')));
            const errorMessage = getErrorMessage(error);
            logger_1.logger.error(`❌ Intelligent scraping failed: ${errorMessage}`);
            throw error;
        }
    }
    async shouldTryDirectFirst(url) {
        const iranianDomains = ['majlis.ir', 'dolat.ir', 'dadgostari.ir'];
        return iranianDomains.some(domain => url.includes(domain));
    }
    async attemptDirectScraping(source, userId, _options) {
        try {
            const response = await axios_1.default.get(source.base_url, {
                timeout: 30000,
                headers: {
                    'User-Agent': this.pickUserAgent(),
                },
            });
            const $ = cheerio_1.default.load(response.data);
            const documents = [];
            const contentSelector = source.selectors?.content || 'body';
            const promises = $(contentSelector)
                .map(async (index, element) => {
                const title = $(element).find(source.selectors?.title || 'h1, h2, h3').first().text().trim();
                const content = $(element).text().trim();
                if (title && content) {
                    const doc = {
                        title,
                        content,
                        source: source.name,
                        url: source.base_url,
                        method: 'direct',
                    };
                    documents.push(doc);
                    await document_service_1.documentService.createDocument({
                        title: doc.title,
                        content: doc.content,
                        category: undefined,
                        source: doc.source,
                        status: 'published',
                        language: 'fa',
                        metadata: {
                            url: doc.url,
                            sourceId: source.id,
                            scrapedAt: new Date().toISOString(),
                            method: 'direct',
                        },
                        keywords: [],
                    }, userId);
                }
            })
                .get();
            await Promise.all(promises);
            return {
                success: true,
                documents,
                method: 'direct',
                message: `Scraped ${documents.length} documents via direct connection`,
            };
        }
        catch (error) {
            const { getErrorMessage } = await Promise.resolve().then(() => __importStar(require('@utils/error-handler')));
            return {
                success: false,
                error: getErrorMessage(error),
                method: 'direct',
            };
        }
    }
}
exports.scrapingService = new ScrapingService();
//# sourceMappingURL=scraping.service.js.map