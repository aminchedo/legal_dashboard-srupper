import axios, { AxiosRequestConfig } from 'axios';
import cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { databaseService } from './database.service';
import { documentService } from './document.service';
import { logger } from '@utils/logger';
import { emitSystemEvent } from '@controllers/websocket.controller';
import { scrapingQueue } from '@queue/queue.config';
import { URL } from 'url';
import { ResilientProxyRotator } from './proxy.service';
import { ScrapingResult, ScrapingSourceRaw } from '../types/scraping.types';

interface ScrapingSource {
  id: string;
  name: string;
  base_url: string;
  selectors: {
    content: string;
    title?: string;
    date?: string;
    category?: string;
    next_page?: string;
  };
  headers?: Record<string, string>;
  created_at: string;
  updated_at?: string | null;
}

interface ScrapingJobRecord {
  id: string;
  url: string;
  source_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: ScrapingResult;
  error?: string | null;
  created_at: string;
  updated_at?: string | null;
  completed_at?: string | null;
  created_by: string;
}

class ScrapingService {
  private db = databaseService.getClient();
  private defaultUserAgents: string[] = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
  ];

  private pickUserAgent(): string {
    const idx = Math.floor(Math.random() * this.defaultUserAgents.length);
    return this.defaultUserAgents[idx];
  }

  /**
   * Create a new scraping job
   */
  async createJob(
    url: string,
    sourceId: string,
    userId: string,
    options: {
      depth?: number;
      filters?: {
        contentTypes?: string[];
        dateRange?: {
          start?: string;
          end?: string;
        };
        keywords?: string[];
      };
    } = {}
  ): Promise<string> {
    const jobId = uuidv4();
    const now = new Date().toISOString();

    // Create job record
    this.db.run(`
      INSERT INTO scraping_jobs (
        id, url, source_id, status, progress, result, error,
        created_at, updated_at, completed_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      jobId, url, sourceId, 'pending', 0, null, null,
      now, now, null, userId
    ]);

    // Add job to queue
    await scrapingQueue.add('scrape', {
      jobId,
      url,
      sourceId,
      depth: options.depth || 1,
      filters: options.filters,
      userId
    });

    // Emit event
    emitSystemEvent('scraping_job_created', {
      jobId,
      url,
      sourceId
    });

    return jobId;
  }

  /**
   * Get a scraping job by ID
   */
  async getJob(jobId: string): Promise<ScrapingJobRecord | null> {
    try {
      const job = this.db.query<ScrapingJobRecord>(`
        SELECT * FROM scraping_jobs WHERE id = ?
      `, [jobId])[0];

      if (!job) {
        return null;
      }

      // Parse JSON fields if they exist
      if (job.result && typeof job.result === 'string') {
        job.result = JSON.parse(job.result);
      }

      return job;
    } catch (error) {
      logger.error('Failed to get scraping job', error);
      throw error;
    }
  }

  /**
   * Update job status
   */
  async updateJobStatus(
    jobId: string,
    status: 'pending' | 'running' | 'completed' | 'failed',
    progress: number
  ): Promise<void> {
    const now = new Date().toISOString();
    const completedAt = status === 'completed' || status === 'failed' ? now : null;

    try {
      this.db.run(`
        UPDATE scraping_jobs
        SET status = ?, progress = ?, updated_at = ?,
            completed_at = ?
        WHERE id = ?
      `, [status, progress, now, completedAt, jobId]);
    } catch (error) {
      logger.error('Failed to update job status', error);
      throw error;
    }
  }

  /**
   * Update job progress
   */
  async updateJobProgress(jobId: string, progress: number): Promise<void> {
    const now = new Date().toISOString();

    try {
      this.db.run(`
        UPDATE scraping_jobs
        SET progress = ?, updated_at = ?
        WHERE id = ?
      `, [progress, now, jobId]);
    } catch (error) {
      logger.error('Failed to update job progress', error);
      throw error;
    }
  }

  /**
   * List scraping jobs with pagination
   */
  async listJobs(options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<{
    items: ScrapingJobRecord[];
    total: number;
    page: number;
    pageCount: number;
  }> {
    const {
      page = 1,
      limit = 20,
      status
    } = options;

    const offset = (page - 1) * limit;

    try {
      // Build where clause
      const whereConditions = [];
      const whereParams = [];

      if (status) {
        whereConditions.push('status = ?');
        whereParams.push(status);
      }

      const whereClause = whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

      // Get total count
      const countResult = this.db.query<{ count: number }>(`
        SELECT COUNT(*) as count FROM scraping_jobs ${whereClause}
      `, whereParams);

      const total = countResult[0].count;

      // Get paginated results
      const results = this.db.query<ScrapingJobRecord>(`
        SELECT * FROM scraping_jobs
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...whereParams, limit, offset]);

      // Parse JSON fields if they exist
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
    } catch (error) {
      logger.error('Failed to list scraping jobs', error);
      throw error;
    }
  }

  /**
   * List available scraping sources
   */
  async listSources(): Promise<(ScrapingSource & { url?: string; category?: string; priority?: number; status?: string })[]> {
    try {
      const results = this.db.query<ScrapingSourceRaw>(
        `SELECT * FROM scraping_sources ORDER BY priority ASC, created_at DESC`
      );
      return results.map((s) => ({
        ...s,
        selectors: typeof s.selectors === 'string' ? JSON.parse(s.selectors) : s.selectors,
        headers: typeof s.headers === 'string' && s.headers ? JSON.parse(s.headers) : s.headers
      }));
    } catch (error) {
      logger.error('Failed to list scraping sources', error);
      throw error;
    }
  }

  /**
   * Create a new scraping source
   */
  async createSource(input: {
    name: string;
    base_url: string;
    url?: string;
    category?: string;
    priority?: number;
    status?: string;
    selectors: ScrapingSource['selectors'];
    headers?: Record<string, string>;
  }): Promise<ScrapingSource & { url?: string; category?: string; priority?: number; status?: string }> {
    const id = uuidv4();
    const now = new Date().toISOString();
    try {
      this.db.run(
        `INSERT INTO scraping_sources (id, name, base_url, url, category, priority, status, selectors, headers, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );
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
    } catch (error) {
      logger.error('Failed to create scraping source', error);
      throw error;
    }
  }

  /**
   * Get a scraping source by ID
   */
  async getSource(sourceId: string): Promise<ScrapingSource | null> {
    try {
      const source = this.db.query<ScrapingSource>(`
        SELECT * FROM scraping_sources WHERE id = ?
      `, [sourceId])[0];

      if (!source) {
        return null;
      }

      // Parse JSON fields if they exist
      if (source.selectors && typeof source.selectors === 'string') {
        source.selectors = JSON.parse(source.selectors);
      }

      if (source.headers && typeof source.headers === 'string') {
        source.headers = JSON.parse(source.headers);
      }

      return source;
    } catch (error) {
      logger.error('Failed to get scraping source', error);
      throw error;
    }
  }

  /**
   * Scrape a URL using the specified source configuration
   */
  async scrapeUrl(
    url: string,
    sourceId: string,
    depth: number = 1,
    _filters = {},
    userId: string,
    progressCallback?: (progress: number) => void
  ): Promise<{
    documentsCreated: number;
    pagesProcessed: number;
    bytesProcessed: number;
  }> {
    let source = await this.getSource(sourceId);
    if (!source) {
      // Fallback to a generic source definition if not configured in DB
      const origin = (() => { try { return new URL(url).origin; } catch { return url; } })();
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
    const rotator = new ResilientProxyRotator(proxies);

    const visited = new Set<string>();
    let currentUrl: string | null = url;
    let pagesProcessed = 0;
    let documentsCreated = 0;
    let bytesProcessed = 0;

    const maxDepth = Math.max(1, depth);

    const fetchWithRetry = async (targetUrl: string, headers?: Record<string, string>): Promise<string> => {
      const maxAttempts = Math.max(1, Math.min(5, proxies.length ? proxies.length : 3));
      let lastError: Error | null = null;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const proxy = rotator.getProxy();
        const axiosConfig: AxiosRequestConfig = {
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

        // Configure proxy if available. Support formats like http(s)://user:pass@host:port
        if (proxy) {
          try {
            const parsed = new URL(proxy);
            if (parsed.hostname && parsed.port) {
              axiosConfig.proxy = {
                host: parsed.hostname,
                port: Number(parsed.port),
                protocol: parsed.protocol.replace(':', ''),
                auth:
                  parsed.username || parsed.password
                    ? { username: decodeURIComponent(parsed.username), password: decodeURIComponent(parsed.password) }
                    : undefined,
              };
            }
          } catch (e) {
            logger.warn(`Invalid proxy URL skipped: ${proxy}`);
          }
        }

        try {
          const res = await axios.request<string>(axiosConfig);
          bytesProcessed += res.data ? Buffer.byteLength(res.data, 'utf8') : 0;
          return res.data;
        } catch (err: unknown) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (proxy) rotator.blacklistProxy(proxy);
          const delay = 500 * (attempt + 1);
          await new Promise((r) => setTimeout(r, delay));
        }
      }
      throw lastError || new Error('Failed to fetch page');
    };

    for (let i = 0; i < maxDepth && currentUrl; i++) {
      if (visited.has(currentUrl)) break;
      visited.add(currentUrl);

      // Report progress
      const progress = Math.round((i / maxDepth) * 100);
      progressCallback?.(progress);
      emitSystemEvent('scraping_update', { url: currentUrl, progress });

      // Fetch and parse
      const html = await fetchWithRetry(currentUrl);
      const $ = cheerio.load(html);

      // Extract data
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
        const created = await documentService.createDocument(
          {
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
          },
          userId
        );

        // Link document to source
        try {
          this.db.run(
            `INSERT OR REPLACE INTO document_source_relations (document_id, source_id, scrape_job_id, url, extracted_at)
             VALUES (?, ?, ?, ?, ?)`,
            [created.id, sourceId, null, currentUrl, new Date().toISOString()]
          );
        } catch (relationErr) {
          logger.warn('Failed to insert document_source_relations', relationErr);
        }

        documentsCreated += 1;
      }

      pagesProcessed += 1;

      // Determine next page if selector provided
      let nextUrl: string | null = null;
      if (source.selectors.next_page) {
        const nextHref = $(source.selectors.next_page).first().attr('href');
        if (nextHref) {
          try {
            const absolute = new URL(nextHref, currentUrl).toString();
            nextUrl = absolute;
          } catch {
            nextUrl = null;
          }
        }
      }
      currentUrl = nextUrl;
    }

    progressCallback?.(100);

    // Save a summary result into scraping_jobs if present
    try {
      this.db.run(
        `UPDATE scraping_jobs SET result = ?, progress = ?, status = ?, updated_at = ?, completed_at = ? WHERE url = ? AND source_id = ?`,
        [
          JSON.stringify({ documentsCreated, pagesProcessed, bytesProcessed }),
          100,
          'completed',
          new Date().toISOString(),
          new Date().toISOString(),
          url,
          sourceId,
        ]
      );
    } catch (err) {
      logger.warn('Failed to persist scraping result summary', err);
    }

    return {
      documentsCreated,
      pagesProcessed,
      bytesProcessed,
    };
  }

  // ADD intelligent scraping method
  async scrapeWithIntelligence(sourceId: string, userId: string, options: Record<string, unknown> = {}) {
    const source = await this.getSource(sourceId);

    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    // Intelligent decision: try direct first, then proxy
    let result;

    try {
      logger.info(`🧠 Attempting intelligent scraping for: ${source.name}`);

      if (await this.shouldTryDirectFirst(source.base_url)) {
        logger.info('🚀 Trying direct connection first...');
        result = await this.attemptDirectScraping(source, userId, options);

        if (result.success) {
          logger.info('✅ Direct scraping successful');
          return result;
        }
      }

      logger.info('🔄 Falling back to proxy scraping...');
      // Using existing scrapeUrl as the main scraping method
      result = await this.scrapeUrl(source.base_url, sourceId, Number(options.depth) || 1, (options.filters as Record<string, unknown>) || {}, userId);

      return { success: true, ...result };
    } catch (error: unknown) {
      const { getErrorMessage } = await import('@utils/error-handler');
      const errorMessage = getErrorMessage(error);
      logger.error(`❌ Intelligent scraping failed: ${errorMessage}`);
      throw error;
    }
  }

  private async shouldTryDirectFirst(url: string): Promise<boolean> {
    // Simple intelligence: try direct for Iranian government sites
    const iranianDomains = ['majlis.ir', 'dolat.ir', 'dadgostari.ir'];
    return iranianDomains.some(domain => url.includes(domain));
  }

  private async attemptDirectScraping(source: ScrapingSource, userId: string, _options: Record<string, unknown>) {
    try {
      // Use same logic as existing scrapeSource but without proxy
      const response = await axios.get(source.base_url, {
        timeout: 30000,
        headers: {
          'User-Agent': this.pickUserAgent(),
        },
      });

      const $ = cheerio.load(response.data);

      const documents: Array<{ url?: string; title?: string; content?: string; source?: string; method?: string }> = [];
      const contentSelector = source.selectors?.content || 'body';

      const promises = $(contentSelector)
        .map(async (index, element) => {
          const title = $(element).find(source.selectors?.title || 'h1, h2, h3').first().text().trim();
          const content = $(element).text().trim();

          if (title && content) {
            const doc: { url: string; title: string; content: string; source: string; method: string } = {
              title,
              content,
              source: source.name,
              url: source.base_url,
              method: 'direct', // Track that this was direct
            };
            documents.push(doc);

            await documentService.createDocument(
              {
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
              },
              userId
            );
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
    } catch (error: unknown) {
      const { getErrorMessage } = await import('@utils/error-handler');
      return {
        success: false,
        error: getErrorMessage(error),
        method: 'direct',
      };
    }
  }
}

export const scrapingService = new ScrapingService();