"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingService = void 0;
const uuid_1 = require("uuid");
const database_service_1 = require("./database.service");
const document_service_1 = require("./document.service");
const logger_1 = require("../utils/logger");
const websocket_controller_1 = require("../controllers/websocket.controller");
class RatingService {
    constructor() {
        this.db = database_service_1.databaseService.getClient();
    }
    async rateDocument(documentId, userId, score, feedback) {
        try {
            const document = await document_service_1.documentService.getDocumentById(documentId);
            if (!document) {
                throw new Error(`Document not found: ${documentId}`);
            }
            if (score < 1 || score > 5) {
                throw new Error('Score must be between 1 and 5');
            }
            const now = new Date().toISOString();
            const existingRating = this.db.query(`
        SELECT * FROM document_ratings
        WHERE document_id = ? AND user_id = ?
      `, [documentId, userId])[0];
            let rating;
            if (existingRating) {
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
            }
            else {
                const id = (0, uuid_1.v4)();
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
            await this.updateDocumentScore(documentId);
            (0, websocket_controller_1.emitDocumentEvent)(documentId, 'document_rated', {
                documentId,
                userId,
                score,
                hasFeedback: !!feedback,
                timestamp: now
            });
            return rating;
        }
        catch (error) {
            logger_1.logger.error('Failed to rate document', error);
            throw error;
        }
    }
    async getRating(ratingId) {
        try {
            const rating = this.db.query(`
        SELECT * FROM document_ratings
        WHERE id = ?
      `, [ratingId])[0];
            return rating || null;
        }
        catch (error) {
            logger_1.logger.error('Failed to get rating', error);
            throw error;
        }
    }
    async getUserRating(documentId, userId) {
        try {
            const rating = this.db.query(`
        SELECT * FROM document_ratings
        WHERE document_id = ? AND user_id = ?
      `, [documentId, userId])[0];
            return rating || null;
        }
        catch (error) {
            logger_1.logger.error('Failed to get user rating', error);
            throw error;
        }
    }
    async getDocumentRatings(documentId, options = {}) {
        try {
            const { page = 1, limit = 20 } = options;
            const offset = (page - 1) * limit;
            const countResult = this.db.query(`
        SELECT COUNT(*) as count FROM document_ratings
        WHERE document_id = ?
      `, [documentId]);
            const total = countResult[0].count;
            const ratings = this.db.query(`
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
        }
        catch (error) {
            logger_1.logger.error('Failed to get document ratings', error);
            throw error;
        }
    }
    async deleteRating(ratingId, userId) {
        try {
            const rating = await this.getRating(ratingId);
            if (!rating) {
                return false;
            }
            if (rating.user_id !== userId) {
                throw new Error('Not authorized to delete this rating');
            }
            this.db.run(`
        DELETE FROM document_ratings
        WHERE id = ?
      `, [ratingId]);
            await this.updateDocumentScore(rating.document_id);
            (0, websocket_controller_1.emitDocumentEvent)(rating.document_id, 'document_rating_deleted', {
                documentId: rating.document_id,
                userId,
                timestamp: new Date().toISOString()
            });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Failed to delete rating', error);
            throw error;
        }
    }
    async getRatingStats(documentId) {
        try {
            const document = await document_service_1.documentService.getDocumentById(documentId);
            if (!document) {
                return null;
            }
            const avgResult = this.db.query(`
        SELECT AVG(score) as avg, COUNT(*) as count
        FROM document_ratings
        WHERE document_id = ?
      `, [documentId])[0];
            const distribution = {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0
            };
            const distResults = this.db.query(`
        SELECT score, COUNT(*) as count
        FROM document_ratings
        WHERE document_id = ?
        GROUP BY score
      `, [documentId]);
            distResults.forEach(row => {
                const score = Math.floor(row.score);
                if (score >= 1 && score <= 5) {
                    distribution[score] = row.count;
                }
            });
            const recentRatings = this.db.query(`
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
        }
        catch (error) {
            logger_1.logger.error('Failed to get rating stats', error);
            throw error;
        }
    }
    async updateDocumentScore(documentId) {
        try {
            const avgResult = this.db.query(`
        SELECT AVG(score) as avg
        FROM document_ratings
        WHERE document_id = ?
      `, [documentId])[0];
            const avgScore = avgResult.avg || null;
            await document_service_1.documentService.updateDocument(documentId, { score: avgScore }, 'system');
        }
        catch (error) {
            logger_1.logger.error('Failed to update document score', error);
            throw error;
        }
    }
}
exports.ratingService = new RatingService();
//# sourceMappingURL=rating.service.js.map