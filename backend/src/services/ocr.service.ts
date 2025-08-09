import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@utils/config';
import { logger } from '@utils/logger';
import { databaseService } from './database.service';
import { documentService } from './document.service';
import { OcrJobInput, OcrJobResult, OcrQualityMetrics } from '@interfaces/ocr.interface';
import { emitSystemEvent } from '@controllers/websocket.controller';
import { scrapingQueue } from '@queue/queue.config';

interface OcrJobRecord {
    id: string;
    file_path: string;
    language: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result: string | null;
    confidence: number | null;
    error: string | null;
    document_id: string | null;
    created_at: string;
    completed_at: string | null;
    created_by: string;
}

interface OcrModelInfo {
    id: string;
    name: string;
    languages: string[];
    accuracy: number;
    version: string;
    size: number;
    created_at: string;
}

class OcrService {
    private db = databaseService.getClient();
    private modelsPath = config.OCR_MODEL_PATH;
    private availableModels: OcrModelInfo[] = [];
    private isProcessing = false;

    constructor() {
        this.initializeModels();
    }

    /**
     * Initialize OCR models
     */
    private async initializeModels(): Promise<void> {
        // For now, simulate available models
        // In a real implementation, this would scan model files and their metadata
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
        logger.info(`Initialized ${this.availableModels.length} OCR models`);
    }

    /**
     * Get available OCR models
     */
    getAvailableModels(): OcrModelInfo[] {
        return this.availableModels;
    }

    /**
     * Process a single file with OCR
     */
    async processFile(input: OcrJobInput, userId: string): Promise<OcrJobResult> {
        const jobId = uuidv4();
        const now = new Date().toISOString();

        try {
            // Check if file exists
            if (!fs.existsSync(input.filePath)) {
                throw new Error(`File not found: ${input.filePath}`);
            }

            // Create job record
            this.db.run(`
        INSERT INTO ocr_jobs (
          id, file_path, language, status, result, confidence,
          error, document_id, created_at, completed_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                jobId, input.filePath, input.language || null, 'processing',
                null, null, null, null, now, null, userId
            ]);

            // Emit event for processing start
            emitSystemEvent('ocr_job_started', {
                jobId,
                filePath: path.basename(input.filePath)
            });

            // Process OCR (simulate processing for now)
            // In a real implementation, this would call an actual OCR engine
            const result = await this.simulateOcrProcessing(input);

            // Update job record with results
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

            // Emit event for processing completion
            emitSystemEvent('ocr_job_completed', {
                jobId,
                filePath: path.basename(input.filePath),
                confidence: result.confidence
            });

            return result;
        } catch (error) {
            // Update job record with error
            this.db.run(`
        UPDATE ocr_jobs SET
          status = ?, error = ?,
          completed_at = ?
        WHERE id = ?
      `, [
                'failed',
                (error as Error).message,
                new Date().toISOString(),
                jobId
            ]);

            // Emit event for processing failure
            emitSystemEvent('ocr_job_failed', {
                jobId,
                filePath: path.basename(input.filePath),
                error: (error as Error).message
            });

            logger.error('OCR processing failed', error);
            throw error;
        }
    }

    /**
     * Process a file and create a document from the results
     */
    async processAndCreateDocument(
        input: OcrJobInput,
        documentMeta: {
            title?: string;
            category?: string;
            source?: string;
        },
        userId: string
    ): Promise<{ documentId: string; ocrResult: OcrJobResult }> {
        try {
            // Process OCR
            const ocrResult = await this.processFile(input, userId);

            // Create document from OCR result
            const document = await documentService.createDocument({
                title: documentMeta.title || path.basename(input.filePath, path.extname(input.filePath)),
                content: ocrResult.text,
                category: documentMeta.category,
                source: documentMeta.source || 'OCR',
                language: ocrResult.language,
                metadata: {
                    ocrConfidence: ocrResult.confidence,
                    originalFile: path.basename(input.filePath),
                    ocrProcessedAt: new Date().toISOString()
                },
                status: 'draft'
            }, userId);

            // Update OCR job with document ID
            this.db.run(`
        UPDATE ocr_jobs SET document_id = ?
        WHERE file_path = ? AND status = 'completed'
        ORDER BY completed_at DESC LIMIT 1
      `, [document.id, input.filePath]);

            return {
                documentId: document.id,
                ocrResult
            };
        } catch (error) {
            logger.error('OCR and document creation failed', error);
            throw error;
        }
    }

    /**
     * Start batch OCR processing on multiple files
     */
    async startBatchProcessing(
        inputs: OcrJobInput[],
        userId: string
    ): Promise<string[]> {
        const jobIds: string[] = [];

        // Add jobs to the queue
        for (const input of inputs) {
            const jobId = uuidv4();
            jobIds.push(jobId);

            const now = new Date().toISOString();

            // Create job record
            this.db.run(`
        INSERT INTO ocr_jobs (
          id, file_path, language, status, result, confidence,
          error, document_id, created_at, completed_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                jobId, input.filePath, input.language || null, 'pending',
                null, null, null, null, now, null, userId
            ]);

            // Add to queue for processing
            await scrapingQueue.add('ocr_job', {
                jobId,
                filePath: input.filePath,
                language: input.language,
                userId
            });

            // Emit event for job queued
            emitSystemEvent('ocr_job_queued', {
                jobId,
                filePath: path.basename(input.filePath)
            });
        }

        return jobIds;
    }

    /**
     * Get OCR job status
     */
    async getJobStatus(jobId: string): Promise<OcrJobRecord | null> {
        try {
            const job = this.db.query<OcrJobRecord>(`
        SELECT * FROM ocr_jobs WHERE id = ?
      `, [jobId])[0];

            if (!job) {
                return null;
            }

            return job;
        } catch (error) {
            logger.error('Failed to get OCR job status', error);
            throw error;
        }
    }

    /**
     * Get OCR quality metrics for a document
     */
    async getQualityMetrics(documentId: string): Promise<OcrQualityMetrics | null> {
        try {
            // Get the document to check if it exists
            const document = await documentService.getDocumentById(documentId);
            if (!document) {
                return null;
            }

            // Get related OCR job
            const job = this.db.query<OcrJobRecord>(`
        SELECT * FROM ocr_jobs 
        WHERE document_id = ?
        ORDER BY completed_at DESC
        LIMIT 1
      `, [documentId])[0];

            if (!job || job.status !== 'completed') {
                return null;
            }

            // In a real implementation, we would analyze the document content
            // For now, simulate quality metrics based on confidence
            const confidence = job.confidence || 0;

            return {
                ocrAccuracy: confidence,
                noiseLevel: 1 - (confidence * 0.8), // Simulate noise level
                textCoverage: 0.85 + (confidence * 0.15) // Simulate text coverage
            };
        } catch (error) {
            logger.error('Failed to get OCR quality metrics', error);
            throw error;
        }
    }

    /**
     * Get overall OCR service status
     */
    getServiceStatus(): {
        status: 'idle' | 'processing';
        activeJobs: number;
        queuedJobs: number;
        modelCount: number;
    } {
        // In a real implementation, this would check actual job queue
        // For now, return simulated status
        return {
            status: this.isProcessing ? 'processing' : 'idle',
            activeJobs: this.isProcessing ? 1 : 0,
            queuedJobs: 0,
            modelCount: this.availableModels.length
        };
    }

    /**
     * Simulate OCR processing (for development)
     */
    private async simulateOcrProcessing(input: OcrJobInput): Promise<OcrJobResult> {
        this.isProcessing = true;

        try {
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Read file extension to determine type
            const ext = path.extname(input.filePath).toLowerCase();

            // Simulate different confidence levels based on file type
            let confidence = 0.85;
            if (ext === '.pdf') confidence = 0.9;
            if (ext === '.jpg' || ext === '.jpeg') confidence = 0.75;
            if (ext === '.png') confidence = 0.8;

            // Randomize confidence slightly
            confidence += (Math.random() * 0.1) - 0.05;
            confidence = Math.max(0.5, Math.min(0.99, confidence));

            // Default language if not specified
            const language = input.language ||
                (input.filePath.includes('persian') ? 'fa' : 'en');

            // Generate fake text based on language and file type
            let text = '';
            if (language === 'fa') {
                text = 'این یک متن نمونه است که برای نشان دادن قابلیت‌های OCR تولید شده است. در یک پیاده‌سازی واقعی، این متن از تصویر یا PDF استخراج می‌شود.';
            } else {
                text = 'This is a sample text generated to demonstrate OCR capabilities. In a real implementation, this text would be extracted from the image or PDF.';
            }

            // Add more text based on file extension to simulate longer documents
            if (ext === '.pdf') {
                text = text.repeat(5);
            }

            return {
                text,
                confidence,
                language
            };
        } finally {
            this.isProcessing = false;
        }
    }
}

export const ocrService = new OcrService();