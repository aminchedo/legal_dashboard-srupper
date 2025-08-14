"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSingle = processSingle;
exports.processAndSave = processAndSave;
exports.batchProcess = batchProcess;
exports.jobStatus = jobStatus;
exports.qualityMetrics = qualityMetrics;
exports.models = models;
exports.status = status;
const ocr_service_1 = require("@services/ocr.service");
const logger_1 = require("@utils/logger");
async function processSingle(req, res) {
    try {
        const { filePath, language } = req.body;
        if (!filePath) {
            return res.status(400).json({ error: 'File path is required' });
        }
        const userId = req.user?.id || 'system';
        const result = await ocr_service_1.ocrService.processFile({ filePath, language }, userId);
        return res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Failed to process OCR', error);
        return res.status(500).json({
            error: 'Failed to process OCR',
            details: error.message
        });
    }
}
async function processAndSave(req, res) {
    try {
        const { filePath, language, title, category, source } = req.body;
        if (!filePath) {
            return res.status(400).json({ error: 'File path is required' });
        }
        const userId = req.user?.id || 'system';
        const result = await ocr_service_1.ocrService.processAndCreateDocument({ filePath, language }, { title, category, source }, userId);
        return res.status(201).json({
            documentId: result.documentId,
            ...result.ocrResult
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to process and save document', error);
        return res.status(500).json({
            error: 'Failed to process and save document',
            details: error.message
        });
    }
}
async function batchProcess(req, res) {
    try {
        const { files } = req.body;
        if (!Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ error: 'Files array is required' });
        }
        const userId = req.user?.id || 'system';
        const jobIds = await ocr_service_1.ocrService.startBatchProcessing(files.map(f => ({
            filePath: f.filePath,
            language: f.language
        })), userId);
        return res.json({
            jobs: jobIds,
            totalJobs: jobIds.length
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start batch OCR processing', error);
        return res.status(500).json({
            error: 'Failed to start batch OCR processing',
            details: error.message
        });
    }
}
async function jobStatus(req, res) {
    try {
        const { id } = req.params;
        const job = await ocr_service_1.ocrService.getJobStatus(id);
        if (!job) {
            return res.status(404).json({ error: 'OCR job not found' });
        }
        return res.json(job);
    }
    catch (error) {
        logger_1.logger.error('Failed to get OCR job status', error);
        return res.status(500).json({
            error: 'Failed to get OCR job status',
            details: error.message
        });
    }
}
async function qualityMetrics(req, res) {
    try {
        const { id } = req.params;
        const metrics = await ocr_service_1.ocrService.getQualityMetrics(id);
        if (!metrics) {
            return res.status(404).json({
                error: 'OCR metrics not found for this document or document does not exist'
            });
        }
        return res.json({
            id,
            metrics
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get OCR metrics', error);
        return res.status(500).json({
            error: 'Failed to get OCR metrics',
            details: error.message
        });
    }
}
async function models(_req, res) {
    try {
        const availableModels = ocr_service_1.ocrService.getAvailableModels();
        return res.json({
            models: availableModels,
            count: availableModels.length
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get OCR models', error);
        return res.status(500).json({
            error: 'Failed to get OCR models',
            details: error.message
        });
    }
}
async function status(_req, res) {
    try {
        const serviceStatus = ocr_service_1.ocrService.getServiceStatus();
        return res.json(serviceStatus);
    }
    catch (error) {
        logger_1.logger.error('Failed to get OCR service status', error);
        return res.status(500).json({
            error: 'Failed to get OCR service status',
            details: error.message
        });
    }
}
//# sourceMappingURL=ocr.controller.js.map