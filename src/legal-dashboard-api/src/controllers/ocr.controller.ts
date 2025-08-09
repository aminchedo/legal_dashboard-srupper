import { Request, Response } from 'express';
import { ocrService } from '@services/ocr.service';
import { logger } from '@utils/logger';

/**
 * Process a single file with OCR
 */
export async function processSingle(req: Request, res: Response) {
  try {
    const { filePath, language } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // @ts-ignore - User is attached by auth middleware
    const userId = req.user?.id || 'system';

    const result = await ocrService.processFile({ filePath, language }, userId);

    return res.json(result);
  } catch (error) {
    logger.error('Failed to process OCR', error);
    return res.status(500).json({
      error: 'Failed to process OCR',
      details: (error as Error).message
    });
  }
}

/**
 * Process a file with OCR and save as a document
 */
export async function processAndSave(req: Request, res: Response) {
  try {
    const { filePath, language, title, category, source } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // @ts-ignore - User is attached by auth middleware
    const userId = req.user?.id || 'system';

    const result = await ocrService.processAndCreateDocument(
      { filePath, language },
      { title, category, source },
      userId
    );

    return res.status(201).json({
      documentId: result.documentId,
      ...result.ocrResult
    });
  } catch (error) {
    logger.error('Failed to process and save document', error);
    return res.status(500).json({
      error: 'Failed to process and save document',
      details: (error as Error).message
    });
  }
}

/**
 * Process multiple files with OCR (batch job)
 */
export async function batchProcess(req: Request, res: Response) {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Files array is required' });
    }

    // @ts-ignore - User is attached by auth middleware
    const userId = req.user?.id || 'system';

    const jobIds = await ocrService.startBatchProcessing(
      files.map(f => ({
        filePath: f.filePath,
        language: f.language
      })),
      userId
    );

    return res.json({
      jobs: jobIds,
      totalJobs: jobIds.length
    });
  } catch (error) {
    logger.error('Failed to start batch OCR processing', error);
    return res.status(500).json({
      error: 'Failed to start batch OCR processing',
      details: (error as Error).message
    });
  }
}

/**
 * Get OCR job status
 */
export async function jobStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const job = await ocrService.getJobStatus(id);

    if (!job) {
      return res.status(404).json({ error: 'OCR job not found' });
    }

    return res.json(job);
  } catch (error) {
    logger.error('Failed to get OCR job status', error);
    return res.status(500).json({
      error: 'Failed to get OCR job status',
      details: (error as Error).message
    });
  }
}

/**
 * Get OCR quality metrics for a document
 */
export async function qualityMetrics(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const metrics = await ocrService.getQualityMetrics(id);

    if (!metrics) {
      return res.status(404).json({
        error: 'OCR metrics not found for this document or document does not exist'
      });
    }

    return res.json({
      id,
      metrics
    });
  } catch (error) {
    logger.error('Failed to get OCR metrics', error);
    return res.status(500).json({
      error: 'Failed to get OCR metrics',
      details: (error as Error).message
    });
  }
}

/**
 * Get available OCR models
 */
export async function models(_req: Request, res: Response) {
  try {
    const availableModels = ocrService.getAvailableModels();

    return res.json({
      models: availableModels,
      count: availableModels.length
    });
  } catch (error) {
    logger.error('Failed to get OCR models', error);
    return res.status(500).json({
      error: 'Failed to get OCR models',
      details: (error as Error).message
    });
  }
}

/**
 * Get OCR service status
 */
export async function status(_req: Request, res: Response) {
  try {
    const serviceStatus = ocrService.getServiceStatus();

    return res.json(serviceStatus);
  } catch (error) {
    logger.error('Failed to get OCR service status', error);
    return res.status(500).json({
      error: 'Failed to get OCR service status',
      details: (error as Error).message
    });
  }
}


