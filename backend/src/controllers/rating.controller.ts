import { Request, Response } from 'express';
import { ratingService } from '@services/rating.service';
import { logger } from '@utils/logger';

/**
 * Rate a document
 */
export async function rateDocument(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;
    
    if (!score || typeof score !== 'number' || score < 1 || score > 5) {
      return res.status(400).json({
        error: 'Score is required and must be a number between 1 and 5'
      });
    }
    

    const userId = (req as any).user?.id || 'system';
    
    const rating = await ratingService.rateDocument(
      id,
      userId,
      score,
      feedback
    );
    
    return res.json({ rating });
  } catch (error) {
    logger.error('Failed to rate document', error);
    return res.status(500).json({
      error: 'Failed to rate document',
      details: (error as Error).message
    });
  }
}

/**
 * Get user's rating for a document
 */
export async function getUserRating(req: Request, res: Response) {
  try {
    const { id } = req.params;
    

    const userId = (req as any).user?.id || 'system';
    
    const rating = await ratingService.getUserRating(id, userId);
    
    if (!rating) {
      return res.json({ rating: null });
    }
    
    return res.json({ rating });
  } catch (error) {
    logger.error('Failed to get user rating', error);
    return res.status(500).json({
      error: 'Failed to get user rating',
      details: (error as Error).message
    });
  }
}

/**
 * Get all ratings for a document
 */
export async function getDocumentRatings(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { page = '1', limit = '20' } = req.query;
    
    const result = await ratingService.getDocumentRatings(id, {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10)
    });
    
    return res.json({
      ratings: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        pageCount: result.pageCount
      }
    });
  } catch (error) {
    logger.error('Failed to get document ratings', error);
    return res.status(500).json({
      error: 'Failed to get document ratings',
      details: (error as Error).message
    });
  }
}

/**
 * Delete a rating
 */
export async function deleteRating(req: Request, res: Response) {
  try {
    const { id } = req.params;
    

    const userId = (req as any).user?.id || 'system';
    
    const success = await ratingService.deleteRating(id, userId);
    
    if (!success) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    return res.json({ deleted: true });
  } catch (error) {
    logger.error('Failed to delete rating', error);
    return res.status(500).json({
      error: 'Failed to delete rating',
      details: (error as Error).message
    });
  }
}

/**
 * Get rating statistics for a document
 */
export async function getRatingStats(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const stats = await ratingService.getRatingStats(id);
    
    if (!stats) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    return res.json({ stats });
  } catch (error) {
    logger.error('Failed to get rating stats', error);
    return res.status(500).json({
      error: 'Failed to get rating stats',
      details: (error as Error).message
    });
  }
}
