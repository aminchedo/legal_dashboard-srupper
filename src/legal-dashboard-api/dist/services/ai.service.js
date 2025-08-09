"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
exports.aiService = {
    analyze(text) {
        return {
            categories: [],
            entities: [],
            sentiment: 0,
            score: Math.min(1, Math.max(0, text.length / 10000)),
        };
    },
};
//# sourceMappingURL=ai.service.js.map