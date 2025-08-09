export interface OcrJobInput {
    filePath: string;
    language?: string; // 'fa' | 'en'
}

export interface OcrJobResult {
    text: string;
    confidence: number; // 0..1
    language?: string;
}

export interface OcrQualityMetrics {
    ocrAccuracy: number;
    noiseLevel: number;
    textCoverage: number;
}


