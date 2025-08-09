import { AiAnalysis } from '@interfaces/ai.interface';

export const aiService = {
    analyze(text: string): AiAnalysis {
        // Placeholder; plug in real NLP/ML later
        return {
            categories: [],
            entities: [],
            sentiment: 0,
            score: Math.min(1, Math.max(0, text.length / 10000)),
        };
    },
};


