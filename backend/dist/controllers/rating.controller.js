"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateDocument = rateDocument;
exports.getUserRating = getUserRating;
exports.getDocumentRatings = getDocumentRatings;
exports.deleteRating = deleteRating;
exports.getRatingStats = getRatingStats;
const rating_service_1 = require("@services/rating.service");
const logger_1 = require("@utils/logger");
async function rateDocument(req, res) {
    try {
        const { id } = req.params;
        const { score, feedback } = req.body;
        if (!score || typeof score !== 'number' || score < 1 || score > 5) {
            return res.status(400).json({
                error: 'Score is required and must be a number between 1 and 5'
            });
        }
        const userId = req.user?.id || 'system';
        const rating = await rating_service_1.ratingService.rateDocument(id, userId, score, feedback);
        return res.json({ rating });
    }
    catch (error) {
        logger_1.logger.error('Failed to rate document', error);
        return res.status(500).json({
            error: 'Failed to rate document',
            details: error.message
        });
    }
}
async function getUserRating(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || 'system';
        const rating = await rating_service_1.ratingService.getUserRating(id, userId);
        if (!rating) {
            return res.json({ rating: null });
        }
        return res.json({ rating });
    }
    catch (error) {
        logger_1.logger.error('Failed to get user rating', error);
        return res.status(500).json({
            error: 'Failed to get user rating',
            details: error.message
        });
    }
}
async function getDocumentRatings(req, res) {
    try {
        const { id } = req.params;
        const { page = '1', limit = '20' } = req.query;
        const result = await rating_service_1.ratingService.getDocumentRatings(id, {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        });
        return res.json({
            ratings: result.items,
            pagination: {
                total: result.total,
                page: result.page,
                pageCount: result.pageCount
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get document ratings', error);
        return res.status(500).json({
            error: 'Failed to get document ratings',
            details: error.message
        });
    }
}
async function deleteRating(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || 'system';
        const success = await rating_service_1.ratingService.deleteRating(id, userId);
        if (!success) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        return res.json({ deleted: true });
    }
    catch (error) {
        logger_1.logger.error('Failed to delete rating', error);
        return res.status(500).json({
            error: 'Failed to delete rating',
            details: error.message
        });
    }
}
async function getRatingStats(req, res) {
    try {
        const { id } = req.params;
        const stats = await rating_service_1.ratingService.getRatingStats(id);
        if (!stats) {
            return res.status(404).json({ error: 'Document not found' });
        }
        return res.json({ stats });
    }
    catch (error) {
        logger_1.logger.error('Failed to get rating stats', error);
        return res.status(500).json({
            error: 'Failed to get rating stats',
            details: error.message
        });
    }
}
//# sourceMappingURL=rating.controller.js.map