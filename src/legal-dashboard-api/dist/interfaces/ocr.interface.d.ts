export interface OcrJobInput {
    filePath: string;
    language?: string;
}
export interface OcrJobResult {
    text: string;
    confidence: number;
    language?: string;
}
export interface OcrQualityMetrics {
    ocrAccuracy: number;
    noiseLevel: number;
    textCoverage: number;
}
