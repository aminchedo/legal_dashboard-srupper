import { v4 as uuidv4 } from 'uuid';
import { databaseService } from './database.service';
import { documentService } from './document.service';
import { logger } from '@utils/logger';
import { emitDocumentEvent } from '@controllers/websocket.controller';

interface DocumentRating {
  id: string;
  document_id: string;
  user_id: string;
  score: number; // 1-5 scale
  feedback?: string | null;
  created_at: string;
  updated_at?: string | null;
}

interface RatingStats {
  documentId: string;
  averageScore: number;
  totalRatings: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  recentRatings: DocumentRating[];
}

class RatingService {
  private db = databaseService.getClient();
  
  /**
   * Rate a document
   */
  async rateDocument(
    documentId: string,
    userId: string,
    score: number,
    feedback?: string
  ): Promise<DocumentRating> {
    try {
      // Validate document exists
      const document = await documentService.getDocumentById(documentId);
      if (!document) {
        throw new Error(`Document not found: ${documentId}`);
      }
      
      // Validate score
      if (score < 1 || score > 5) {
        throw new Error('Score must be between 1 and 5');
      }
      
      const now = new Date().toISOString();
      
      // Check if rating already exists
      const existingRating = this.db.query<DocumentRating>(`
        SELECT * FROM document_ratings
        WHERE document_id = ? AND user_id = ?
      `, [documentId, userId])[0];
      
      let rating: DocumentRating;
      
      if (existingRating) {
        // Update existing rating
        this.db.run(`
          UPDATE document_ratings
          SET score = ?, feedback = ?, updated_at = ?
          WHERE id = ?
        `, [score, feedback || null, now, existingRating.id]);
        
        rating = {
          ...existingRating,
          score,
          feedback: feedback || null,
          updated_at: now
        };
      } else {
        // Create new rating
        const id = uuidv4();
        
        this.db.run(`
          INSERT INTO document_ratings (
            id, document_id, user_id, score, feedback, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id, documentId, userId, score, feedback || null, now, null]);
        
        rating = {
          id,
          document_id: documentId,
          user_id: userId,
          score,
          feedback: feedback || null,
          created_at: now,
          updated_at: null
        };
      }
      
      // Calculate and update document score
      await this.updateDocumentScore(documentId);
      
      // Emit event
      emitDocumentEvent(documentId, 'document_rated', {
        documentId,
        userId,
        score,
        hasFeedback: !!feedback,
        timestamp: now
      });
      
      return rating;
    } catch (error) {
      logger.error('Failed to rate document', error);
      throw error;
    }
  }
  
  /**
   * Get a specific rating
   */
  async getRating(
    ratingId: string
  ): Promise<DocumentRating | null> {
    try {
      const rating = this.db.query<DocumentRating>(`
        SELECT * FROM document_ratings
        WHERE id = ?
      `, [ratingId])[0];
      
      return rating || null;
    } catch (error) {
      logger.error('Failed to get rating', error);
      throw error;
    }
  }
  
  /**
   * Get a user's rating for a document
   */
  async getUserRating(
    documentId: string,
    userId: string
  ): Promise<DocumentRating | null> {
    try {
      const rating = this.db.query<DocumentRating>(`
        SELECT * FROM document_ratings
        WHERE document_id = ? AND user_id = ?
      `, [documentId, userId])[0];
      
      return rating || null;
    } catch (error) {
      logger.error('Failed to get user rating', error);
      throw error;
    }
  }
  
  /**
   * Get all ratings for a document
   */
  async getDocumentRatings(
    documentId: string,
    options: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    items: DocumentRating[];
    total: number;
    page: number;
    pageCount: number;
  }> {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;
      
      // Get total count
      const countResult = this.db.query<{ count: number }>(`
        SELECT COUNT(*) as count FROM document_ratings
        WHERE document_id = ?
      `, [documentId]);
      
      const total = countResult[0].count;
      
      // Get paginated results
      const ratings = this.db.query<DocumentRating>(`
        SELECT * FROM document_ratings
        WHERE document_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [documentId, limit, offset]);
      
      return {
        items: ratings,
        total,
        page,
        pageCount: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Failed to get document ratings', error);
      throw error;
    }
  }
  
  /**
   * Delete a rating
   */
  async deleteRating(
    ratingId: string,
    userId: string
  ): Promise<boolean> {
    try {
      // Get rating to check ownership
      const rating = await this.getRating(ratingId);
      
      if (!rating) {
        return false;
      }
      
      // Only allow deletion by the rating owner
      if (rating.user_id !== userId) {
        throw new Error('Not authorized to delete this rating');
      }
      
      // Delete rating
      this.db.run(`
        DELETE FROM document_ratings
        WHERE id = ?
      `, [ratingId]);
      
      // Update document score
      await this.updateDocumentScore(rating.document_id);
      
      // Emit event
      emitDocumentEvent(rating.document_id, 'document_rating_deleted', {
        documentId: rating.document_id,
        userId,
        timestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      logger.error('Failed to delete rating', error);
      throw error;
    }
  }
  
  /**
   * Get rating statistics for a document
   */
  async getRatingStats(documentId: string): Promise<RatingStats | null> {
    try {
      // Check if document exists
      const document = await documentService.getDocumentById(documentId);
      if (!document) {
        return null;
      }
      
      // Get average score and total count
      const avgResult = this.db.query<{ avg: number; count: number }>(`
        SELECT AVG(score) as avg, COUNT(*) as count
        FROM document_ratings
        WHERE document_id = ?
      `, [documentId])[0];
      
      // Get distribution
      const distribution = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0
      };
      
      const distResults = this.db.query<{ score: number; count: number }>(`
        SELECT score, COUNT(*) as count
        FROM document_ratings
        WHERE document_id = ?
        GROUP BY score
      `, [documentId]);
      
      distResults.forEach(row => {
        const score = Math.floor(row.score) as 1 | 2 | 3 | 4 | 5;
        if (score >= 1 && score <= 5) {
          distribution[score] = row.count;
        }
      });
      
      // Get recent ratings
      const recentRatings = this.db.query<DocumentRating>(`
        SELECT * FROM document_ratings
        WHERE document_id = ?
        ORDER BY created_at DESC
        LIMIT 5
      `, [documentId]);
      
      return {
        documentId,
        averageScore: avgResult.avg || 0,
        totalRatings: avgResult.count || 0,
        distribution,
        recentRatings
      };
    } catch (error) {
      logger.error('Failed to get rating stats', error);
      throw error;
    }
  }
  
  /**
   * Update the document score based on ratings
   */
  private async updateDocumentScore(documentId: string): Promise<void> {
    try {
      // Calculate average score
      const avgResult = this.db.query<{ avg: number }>(`
        SELECT AVG(score) as avg
        FROM document_ratings
        WHERE document_id = ?
      `, [documentId])[0];
      
      const avgScore = avgResult.avg || null;
      
      // Update document score
      await documentService.updateDocument(
        documentId,
        { score: avgScore },
        'system'
      );
    } catch (error) {
      logger.error('Failed to update document score', error);
      throw error;
    }
  }
}

export const ratingService = new RatingService();
