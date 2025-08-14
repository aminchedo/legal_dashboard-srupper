import { Request, Response } from 'express';
import { analyticsService } from '@services/analytics.service';
import { logger } from '@utils/logger';

/**
 * Get dashboard analytics overview
 */
export async function overview(req: Request, res: Response) {
  try {
    const { period = 'week' } = req.query;
    
    const metrics = await analyticsService.getDashboardMetrics(
      period as 'day' | 'week' | 'month' | 'year'
    );
    
    return res.json({ 
      overview: {
        metrics,
        period
      }
    });
  } catch (error) {
    logger.error('Failed to get analytics overview', error);
    return res.status(500).json({
      error: 'Failed to get analytics overview',
      details: (error as Error).message
    });
  }
}

/**
 * Analyze a document with sentiment analysis, entity extraction, and categorization
 */
export async function analyzeDocument(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const results = await analyticsService.analyzeDocument(id);
    
    if (!results.sentiment && !results.category) {
      return res.status(404).json({ 
        error: 'Document not found or unable to analyze' 
      });
    }
    
    return res.json({
      documentId: id,
      results
    });
  } catch (error) {
    logger.error('Failed to analyze document', error);
    return res.status(500).json({
      error: 'Failed to analyze document',
      details: (error as Error).message
    });
  }
}

/**
 * Calculate sentiment for a document
 */
export async function sentiment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const sentiment = await analyticsService.calculateSentiment(id);
    
    if (!sentiment) {
      return res.status(404).json({ 
        error: 'Document not found' 
      });
    }
    
    return res.json({ sentiment });
  } catch (error) {
    logger.error('Failed to calculate sentiment', error);
    return res.status(500).json({
      error: 'Failed to calculate sentiment',
      details: (error as Error).message
    });
  }
}

/**
 * Calculate document similarity between two documents
 */
export async function similarity(req: Request, res: Response) {
  try {
    const { doc1Id, doc2Id } = req.query;
    
    if (!doc1Id || !doc2Id) {
      return res.status(400).json({ 
        error: 'Both doc1Id and doc2Id query parameters are required' 
      });
    }
    
    const similarity = await analyticsService.calculateDocumentSimilarity(
      doc1Id as string,
      doc2Id as string
    );
    
    if (!similarity) {
      return res.status(404).json({ 
        error: 'One or both documents not found' 
      });
    }
    
    return res.json({ similarity });
  } catch (error) {
    logger.error('Failed to calculate document similarity', error);
    return res.status(500).json({
      error: 'Failed to calculate document similarity',
      details: (error as Error).message
    });
  }
}

/**
 * Extract entities from a document
 */
export async function entities(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const entities = await analyticsService.extractEntities(id);
    
    return res.json({ 
      documentId: id,
      entities,
      count: entities.length
    });
  } catch (error) {
    logger.error('Failed to extract entities', error);
    return res.status(500).json({
      error: 'Failed to extract entities',
      details: (error as Error).message
    });
  }
}

/**
 * Predict document category
 */
export async function predictCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const category = await analyticsService.predictCategory(id);
    
    if (!category) {
      return res.status(404).json({ 
        error: 'Document not found' 
      });
    }
    
    return res.json({ category });
  } catch (error) {
    logger.error('Failed to predict category', error);
    return res.status(500).json({
      error: 'Failed to predict category',
      details: (error as Error).message
    });
  }
}

/**
 * Generate topics from multiple documents
 */
export async function generateTopics(req: Request, res: Response) {
  try {
    const { name, documentIds } = req.body;
    
    if (!name || !documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({ 
        error: 'Name and documentIds array are required' 
      });
    }
    
    const topics = await analyticsService.generateTopics(
      name,
      documentIds
    );
    
    if (!topics) {
      return res.status(404).json({ 
        error: 'No valid documents found' 
      });
    }
    
    return res.json({ topics });
  } catch (error) {
    logger.error('Failed to generate topics', error);
    return res.status(500).json({
      error: 'Failed to generate topics',
      details: (error as Error).message
    });
  }
}


