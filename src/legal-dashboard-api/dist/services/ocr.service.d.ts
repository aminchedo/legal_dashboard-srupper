import { OcrJobInput, OcrJobResult, OcrQualityMetrics } from '../interfaces/ocr.interface';
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
declare class OcrService {
    private db;
    private modelsPath;
    private availableModels;
    private isProcessing;
    constructor();
    private initializeModels;
    getAvailableModels(): OcrModelInfo[];
    processFile(input: OcrJobInput, userId: string): Promise<OcrJobResult>;
    processAndCreateDocument(input: OcrJobInput, documentMeta: {
        title?: string;
        category?: string;
        source?: string;
    }, userId: string): Promise<{
        documentId: string;
        ocrResult: OcrJobResult;
    }>;
    startBatchProcessing(inputs: OcrJobInput[], userId: string): Promise<string[]>;
    getJobStatus(jobId: string): Promise<OcrJobRecord | null>;
    getQualityMetrics(documentId: string): Promise<OcrQualityMetrics | null>;
    getServiceStatus(): {
        status: 'idle' | 'processing';
        activeJobs: number;
        queuedJobs: number;
        modelCount: number;
    };
    private simulateOcrProcessing;
}
export declare const ocrService: OcrService;
export {};
