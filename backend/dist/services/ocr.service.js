"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("@utils/config");
const logger_1 = require("@utils/logger");
const database_service_1 = require("./database.service");
const document_service_1 = require("./document.service");
const websocket_controller_1 = require("@controllers/websocket.controller");
const queue_config_1 = require("@queue/queue.config");
class OcrService {
    constructor() {
        this.db = database_service_1.databaseService.getClient();
        this.modelsPath = config_1.config.OCR_MODEL_PATH;
        this.availableModels = [];
        this.isProcessing = false;
        this.initializeModels();
    }
    async initializeModels() {
        this.availableModels = [
            {
                id: 'persian-legal-v1',
                name: 'Persian Legal Documents OCR',
                languages: ['fa'],
                accuracy: 0.92,
                version: '1.0.0',
                size: 450000000,
                created_at: new Date().toISOString()
            },
            {
                id: 'english-legal-v1',
                name: 'English Legal Documents OCR',
                languages: ['en'],
                accuracy: 0.95,
                version: '1.0.0',
                size: 350000000,
                created_at: new Date().toISOString()
            },
            {
                id: 'multilingual-v2',
                name: 'Multilingual OCR',
                languages: ['en', 'fa', 'ar'],
                accuracy: 0.88,
                version: '2.0.0',
                size: 780000000,
                created_at: new Date().toISOString()
            }
        ];
        logger_1.logger.info(`Initialized ${this.availableModels.length} OCR models`);
    }
    getAvailableModels() {
        return this.availableModels;
    }
    async processFile(input, userId) {
        const jobId = (0, uuid_1.v4)();
        const now = new Date().toISOString();
        try {
            if (!fs_1.default.existsSync(input.filePath)) {
                throw new Error(`File not found: ${input.filePath}`);
            }
            this.db.run(`
        INSERT INTO ocr_jobs (
          id, file_path, language, status, result, confidence,
          error, document_id, created_at, completed_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                jobId, input.filePath, input.language || null, 'processing',
                null, null, null, null, now, null, userId
            ]);
            (0, websocket_controller_1.emitSystemEvent)('ocr_job_started', {
                jobId,
                filePath: path_1.default.basename(input.filePath)
            });
            const result = await this.simulateOcrProcessing(input);
            this.db.run(`
        UPDATE ocr_jobs SET
          status = ?, result = ?, confidence = ?,
          completed_at = ?
        WHERE id = ?
      `, [
                'completed',
                JSON.stringify(result),
                result.confidence,
                new Date().toISOString(),
                jobId
            ]);
            (0, websocket_controller_1.emitSystemEvent)('ocr_job_completed', {
                jobId,
                filePath: path_1.default.basename(input.filePath),
                confidence: result.confidence
            });
            return result;
        }
        catch (error) {
            this.db.run(`
        UPDATE ocr_jobs SET
          status = ?, error = ?,
          completed_at = ?
        WHERE id = ?
      `, [
                'failed',
                error.message,
                new Date().toISOString(),
                jobId
            ]);
            (0, websocket_controller_1.emitSystemEvent)('ocr_job_failed', {
                jobId,
                filePath: path_1.default.basename(input.filePath),
                error: error.message
            });
            logger_1.logger.error('OCR processing failed', error);
            throw error;
        }
    }
    async processAndCreateDocument(input, documentMeta, userId) {
        try {
            const ocrResult = await this.processFile(input, userId);
            const document = await document_service_1.documentService.createDocument({
                title: documentMeta.title || path_1.default.basename(input.filePath, path_1.default.extname(input.filePath)),
                content: ocrResult.text,
                category: documentMeta.category,
                source: documentMeta.source || 'OCR',
                language: ocrResult.language,
                metadata: {
                    ocrConfidence: ocrResult.confidence,
                    originalFile: path_1.default.basename(input.filePath),
                    ocrProcessedAt: new Date().toISOString()
                },
                status: 'draft'
            }, userId);
            this.db.run(`
        UPDATE ocr_jobs SET document_id = ?
        WHERE file_path = ? AND status = 'completed'
        ORDER BY completed_at DESC LIMIT 1
      `, [document.id, input.filePath]);
            return {
                documentId: document.id,
                ocrResult
            };
        }
        catch (error) {
            logger_1.logger.error('OCR and document creation failed', error);
            throw error;
        }
    }
    async startBatchProcessing(inputs, userId) {
        const jobIds = [];
        for (const input of inputs) {
            const jobId = (0, uuid_1.v4)();
            jobIds.push(jobId);
            const now = new Date().toISOString();
            this.db.run(`
        INSERT INTO ocr_jobs (
          id, file_path, language, status, result, confidence,
          error, document_id, created_at, completed_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                jobId, input.filePath, input.language || null, 'pending',
                null, null, null, null, now, null, userId
            ]);
            await queue_config_1.scrapingQueue.add('ocr_job', {
                jobId,
                filePath: input.filePath,
                language: input.language,
                userId
            });
            (0, websocket_controller_1.emitSystemEvent)('ocr_job_queued', {
                jobId,
                filePath: path_1.default.basename(input.filePath)
            });
        }
        return jobIds;
    }
    async getJobStatus(jobId) {
        try {
            const job = this.db.query(`
        SELECT * FROM ocr_jobs WHERE id = ?
      `, [jobId])[0];
            if (!job) {
                return null;
            }
            return job;
        }
        catch (error) {
            logger_1.logger.error('Failed to get OCR job status', error);
            throw error;
        }
    }
    async getQualityMetrics(documentId) {
        try {
            const document = await document_service_1.documentService.getDocumentById(documentId);
            if (!document) {
                return null;
            }
            const job = this.db.query(`
        SELECT * FROM ocr_jobs 
        WHERE document_id = ?
        ORDER BY completed_at DESC
        LIMIT 1
      `, [documentId])[0];
            if (!job || job.status !== 'completed') {
                return null;
            }
            const confidence = job.confidence || 0;
            return {
                ocrAccuracy: confidence,
                noiseLevel: 1 - (confidence * 0.8),
                textCoverage: 0.85 + (confidence * 0.15)
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get OCR quality metrics', error);
            throw error;
        }
    }
    getServiceStatus() {
        return {
            status: this.isProcessing ? 'processing' : 'idle',
            activeJobs: this.isProcessing ? 1 : 0,
            queuedJobs: 0,
            modelCount: this.availableModels.length
        };
    }
    async simulateOcrProcessing(input) {
        this.isProcessing = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const ext = path_1.default.extname(input.filePath).toLowerCase();
            let confidence = 0.85;
            if (ext === '.pdf')
                confidence = 0.9;
            if (ext === '.jpg' || ext === '.jpeg')
                confidence = 0.75;
            if (ext === '.png')
                confidence = 0.8;
            confidence += (Math.random() * 0.1) - 0.05;
            confidence = Math.max(0.5, Math.min(0.99, confidence));
            const language = input.language ||
                (input.filePath.includes('persian') ? 'fa' : 'en');
            let text = '';
            if (language === 'fa') {
                text = 'این یک متن نمونه است که برای نشان دادن قابلیت‌های OCR تولید شده است. در یک پیاده‌سازی واقعی، این متن از تصویر یا PDF استخراج می‌شود.';
            }
            else {
                text = 'This is a sample text generated to demonstrate OCR capabilities. In a real implementation, this text would be extracted from the image or PDF.';
            }
            if (ext === '.pdf') {
                text = text.repeat(5);
            }
            return {
                text,
                confidence,
                language
            };
        }
        finally {
            this.isProcessing = false;
        }
    }
}
exports.ocrService = new OcrService();
//# sourceMappingURL=ocr.service.js.map