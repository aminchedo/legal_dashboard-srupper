"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overview = overview;
exports.analyzeDocument = analyzeDocument;
exports.sentiment = sentiment;
exports.similarity = similarity;
exports.entities = entities;
exports.predictCategory = predictCategory;
exports.generateTopics = generateTopics;
const analytics_service_1 = require("@services/analytics.service");
const logger_1 = require("@utils/logger");
async function overview(req, res) {
    try {
        const { period = 'week' } = req.query;
        const metrics = await analytics_service_1.analyticsService.getDashboardMetrics(period);
        return res.json({
            overview: {
                metrics,
                period
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get analytics overview', error);
        return res.status(500).json({
            error: 'Failed to get analytics overview',
            details: error.message
        });
    }
}
async function analyzeDocument(req, res) {
    try {
        const { id } = req.params;
        const results = await analytics_service_1.analyticsService.analyzeDocument(id);
        if (!results.sentiment && !results.category) {
            return res.status(404).json({
                error: 'Document not found or unable to analyze'
            });
        }
        return res.json({
            documentId: id,
            results
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to analyze document', error);
        return res.status(500).json({
            error: 'Failed to analyze document',
            details: error.message
        });
    }
}
async function sentiment(req, res) {
    try {
        const { id } = req.params;
        const sentiment = await analytics_service_1.analyticsService.calculateSentiment(id);
        if (!sentiment) {
            return res.status(404).json({
                error: 'Document not found'
            });
        }
        return res.json({ sentiment });
    }
    catch (error) {
        logger_1.logger.error('Failed to calculate sentiment', error);
        return res.status(500).json({
            error: 'Failed to calculate sentiment',
            details: error.message
        });
    }
}
async function similarity(req, res) {
    try {
        const { doc1Id, doc2Id } = req.query;
        if (!doc1Id || !doc2Id) {
            return res.status(400).json({
                error: 'Both doc1Id and doc2Id query parameters are required'
            });
        }
        const similarity = await analytics_service_1.analyticsService.calculateDocumentSimilarity(doc1Id, doc2Id);
        if (!similarity) {
            return res.status(404).json({
                error: 'One or both documents not found'
            });
        }
        return res.json({ similarity });
    }
    catch (error) {
        logger_1.logger.error('Failed to calculate document similarity', error);
        return res.status(500).json({
            error: 'Failed to calculate document similarity',
            details: error.message
        });
    }
}
async function entities(req, res) {
    try {
        const { id } = req.params;
        const entities = await analytics_service_1.analyticsService.extractEntities(id);
        return res.json({
            documentId: id,
            entities,
            count: entities.length
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to extract entities', error);
        return res.status(500).json({
            error: 'Failed to extract entities',
            details: error.message
        });
    }
}
async function predictCategory(req, res) {
    try {
        const { id } = req.params;
        const category = await analytics_service_1.analyticsService.predictCategory(id);
        if (!category) {
            return res.status(404).json({
                error: 'Document not found'
            });
        }
        return res.json({ category });
    }
    catch (error) {
        logger_1.logger.error('Failed to predict category', error);
        return res.status(500).json({
            error: 'Failed to predict category',
            details: error.message
        });
    }
}
async function generateTopics(req, res) {
    try {
        const { name, documentIds } = req.body;
        if (!name || !documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
            return res.status(400).json({
                error: 'Name and documentIds array are required'
            });
        }
        const topics = await analytics_service_1.analyticsService.generateTopics(name, documentIds);
        if (!topics) {
            return res.status(404).json({
                error: 'No valid documents found'
            });
        }
        return res.json({ topics });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate topics', error);
        return res.status(500).json({
            error: 'Failed to generate topics',
            details: error.message
        });
    }
}
//# sourceMappingURL=analytics.controller.js.map