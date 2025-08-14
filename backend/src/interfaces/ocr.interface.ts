export interface OcrJobInput {
  id: string;
  filePath: string;
  language?: string;
  options?: {
    language?: string;
    psm?: number;
    oem?: number;
  };
}

export interface OcrJobResult {
  id: string;
  text: string;
  confidence: number;
  language?: string;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x: number; y: number; w: number; h: number };
  }>;
  metadata: {
    pages: number;
    processingTime: number;
    language: string;
  };
}

export interface OcrQualityMetrics {
  averageConfidence: number;
  wordCount: number;
  lowConfidenceWords: number;
  qualityScore: number;
  ocrAccuracy?: number;
}