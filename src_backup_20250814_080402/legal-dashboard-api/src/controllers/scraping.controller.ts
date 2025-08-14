import { Request, Response } from 'express';
import { scrapingService } from '@services/scraping.service';
import { logger } from '@utils/logger';
import { scrapingQueue } from '@queue/queue.config';
import { databaseService } from '@services/database.service';

/**
 * Start a new scraping job
 */
export async function start(req: Request, res: Response) {
  try {
    const { url, sourceId, depth, filters } = req.body;

    if (!url || !sourceId) {
      return res.status(400).json({
        error: 'URL and sourceId are required'
      });
    }


    const userId = req.user?.id || 'system';

    const jobId = await scrapingService.createJob(
      url,
      sourceId,
      userId,
      { depth, filters }
    );

    return res.status(201).json({ jobId });
  } catch (error) {
    logger.error('Failed to start scraping job', error);
    return res.status(500).json({
      error: 'Failed to start scraping job',
      details: (error as Error).message
    });
  }
}

/**
 * Get all scraping jobs with status
 */
export async function status(req: Request, res: Response) {
  try {
    const {
      page = '1',
      limit = '20',
      status: jobStatus
    } = req.query;

    const result = await scrapingService.listJobs({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      status: jobStatus as string
    });

    return res.json({
      jobs: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        pageCount: result.pageCount
      }
    });
  } catch (error) {
    logger.error('Failed to list scraping jobs', error);
    return res.status(500).json({
      error: 'Failed to list scraping jobs',
      details: (error as Error).message
    });
  }
}

/**
 * Get status of a specific scraping job
 */
export async function statusById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const job = await scrapingService.getJob(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.json(job);
  } catch (error) {
    logger.error('Failed to get job status', error);
    return res.status(500).json({
      error: 'Failed to get job status',
      details: (error as Error).message
    });
  }
}

/**
 * List sources available for scraping
 */
export async function sources(req: Request, res: Response) {
  try {
    const sources = await scrapingService.listSources();

    return res.json({ sources, count: sources.length });
  } catch (error) {
    logger.error('Failed to list scraping sources', error);
    return res.status(500).json({
      error: 'Failed to list scraping sources',
      details: (error as Error).message
    });
  }
}

/**
 * Create a new scraping source
 */
export async function createSource(req: Request, res: Response) {
  try {
    const { name, baseUrl, url, category, priority, status, selectors, headers } = req.body;

    if (!name || !baseUrl || !selectors || !selectors.content) {
      return res.status(400).json({
        error: 'Name, baseUrl, and selectors.content are required'
      });
    }

    const source = await scrapingService.createSource({
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
  } catch (error) {
    logger.error('Failed to create scraping source', error);
    return res.status(500).json({
      error: 'Failed to create scraping source',
      details: (error as Error).message
    });
  }
}

/**
 * Stop a specific scraping job
 */
export async function stopById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Get job to check if it exists
    const job = await scrapingService.getJob(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get Bull job to remove from queue if pending
    if (job.status === 'pending') {
      const jobs = await scrapingQueue.getJobs(['waiting', 'delayed', 'paused']);
      const bullJob = jobs.find(j =>
        j.data && j.data.jobId === id
      );

      if (bullJob) {
        await bullJob.remove();
      }
    }

    // Update job status to failed/stopped
    await scrapingService.updateJobStatus(id, 'failed', job.progress);

    return res.json({
      id,
      stopped: true,
      previousStatus: job.status
    });
  } catch (error) {
    logger.error('Failed to stop job', error);
    return res.status(500).json({
      error: 'Failed to stop job',
      details: (error as Error).message
    });
  }
}

/**
 * Stop all currently running scraping jobs
 */
export async function stopAll(req: Request, res: Response) {
  try {
    // Clean Bull queue
    await scrapingQueue.clean(0, 'wait');
    await scrapingQueue.clean(0, 'active');
    await scrapingQueue.clean(0, 'delayed');

    // Get running and pending jobs
    const result = await scrapingService.listJobs({
      limit: 1000,
      status: 'running'
    });

    const pendingResult = await scrapingService.listJobs({
      limit: 1000,
      status: 'pending'
    });

    // Mark all as failed/stopped
    for (const job of [...result.items, ...pendingResult.items]) {
      await scrapingService.updateJobStatus(job.id, 'failed', job.progress);
    }

    return res.json({
      stopped: true,
      count: result.items.length + pendingResult.items.length
    });
  } catch (error) {
    logger.error('Failed to stop all jobs', error);
    return res.status(500).json({
      error: 'Failed to stop all jobs',
      details: (error as Error).message
    });
  }
}

/**
 * Get scraping service health status
 */
export async function health(req: Request, res: Response) {
  try {
    // Check queue health
    const counts = await scrapingQueue.getJobCounts();
    const db = databaseService.getClient();
    const perSource = db.query<{ source: string; count: number }>(
      `SELECT ds.source_id as source, COUNT(*) as count
       FROM document_source_relations ds
       GROUP BY ds.source_id`
    );
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
  } catch (error) {
    logger.error('Failed to get health status', error);
    return res.status(500).json({
      error: 'Failed to get health status',
      details: (error as Error).message
    });
  }
}

/**
 * Start priority rotation scraping across mandated sources
 */
export async function rotate(req: Request, res: Response) {
  try {

    const userId = req.user?.id || 'system';
    const db = databaseService.getClient();
    const sources = db.query<{ id: string; name: string; url: string; base_url: string }>(
      'SELECT id, name, url, base_url FROM scraping_sources'
    );
    const byHost = new Map<string, { id: string; name: string; url: string }>();
    for (const s of sources) {
      const url = (s.url || s.base_url);
      try {
        const host = new URL(url).hostname.replace(/^www\./, '');
        byHost.set(host, { id: s.id, name: s.name, url });
      } catch {
        // Invalid URL format, skip this source
      }
    }
    const planHosts = [
      // Cycle 1
      'qavanin.ir', 'rrk.ir', 'majlis.ir',
      // Cycle 2
      'dolat.ir', 'dadgostari.ir', 'rc.majlis.ir',
      // Cycle 3
      'shura-gc.ir', 'moj.ir'
    ];
    const jobs: Array<{ host: string; jobId?: string; skipped?: boolean }> = [];
    for (const host of planHosts) {
      const entry = [...byHost.entries()].find(([h]) => h === host || h.endsWith(host));
      if (!entry) {
        jobs.push({ host, skipped: true });
        continue;
      }
      const [, src] = entry;
      const jobId = await scrapingService.createJob(src.url, src.id, userId, { depth: 5 });
      jobs.push({ host, jobId });
    }
    return res.json({ started: true, jobs });
  } catch (error) {
    logger.error('Failed to start rotation', error);
    return res.status(500).json({ error: 'Failed to start rotation', details: (error as Error).message });
  }
}


