"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const uuid_1 = require("uuid");
const database_service_1 = require("./database.service");
const document_service_1 = require("./document.service");
const logger_1 = require("../utils/logger");
const websocket_controller_1 = require("../controllers/websocket.controller");
class AnalyticsService {
    constructor() {
        this.db = database_service_1.databaseService.getClient();
    }
    async getDashboardMetrics(period = 'week') {
        try {
            const metrics = this.db.query(`
        SELECT * FROM analytics_metrics
        WHERE period = ?
        ORDER BY created_at DESC
      `, [period]);
            return metrics;
        }
        catch (error) {
            logger_1.logger.error('Failed to get dashboard metrics', error);
            throw error;
        }
    }
    async calculateSentiment(documentId) {
        try {
            const document = await document_service_1.documentService.getDocumentById(documentId);
            if (!document) {
                return null;
            }
            const sentimentScore = Math.random() * 2 - 1;
            const confidence = 0.7 + Math.random() * 0.3;
            const now = new Date().toISOString();
            this.db.run(`
        INSERT OR REPLACE INTO document_sentiments (
          document_id, score, confidence, analyzed_at
        ) VALUES (?, ?, ?, ?)
      `, [documentId, sentimentScore, confidence, now]);
            return {
                documentId,
                score: sentimentScore,
                confidence,
                analyzed_at: now
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to calculate document sentiment', error);
            throw error;
        }
    }
    async extractEntities(documentId) {
        try {
            const document = await document_service_1.documentService.getDocumentById(documentId);
            if (!document) {
                return [];
            }
            const now = new Date().toISOString();
            const content = document.content.toLowerCase();
            const entities = [];
            const entityPatterns = [
                { regex: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, type: 'DATE' },
                { regex: /\b\d+\s*(ریال|تومان)\b/g, type: 'MONEY' },
                { regex: /\bماده\s*\d+\b/g, type: 'LEGAL_REFERENCE' },
                { regex: /\bقانون\s+[\u0600-\u06FF\s]{3,50}?\b/g, type: 'LAW' },
                { regex: /\b(تهران|مشهد|اصفهان|شیراز|تبریز)\b/g, type: 'LOCATION' }
            ];
            entityPatterns.forEach(pattern => {
                const matches = content.match(pattern.regex);
                if (matches) {
                    const uniqueMatches = [...new Set(matches)];
                    uniqueMatches.forEach(entity => {
                        entities.push({
                            documentId,
                            entity: entity.trim(),
                            type: pattern.type,
                            count: matches.filter(m => m === entity).length,
                            confidence: 0.8 + Math.random() * 0.2,
                            analyzed_at: now
                        });
                    });
                }
            });
            const transaction = this.db.transaction();
            try {
                transaction.begin();
                this.db.run(`
          DELETE FROM document_entities
          WHERE document_id = ?
        `, [documentId]);
                for (const entity of entities) {
                    this.db.run(`
            INSERT INTO document_entities (
              document_id, entity, type, count, confidence, analyzed_at
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
                        entity.documentId,
                        entity.entity,
                        entity.type,
                        entity.count,
                        entity.confidence,
                        entity.analyzed_at
                    ]);
                }
                transaction.commit();
            }
            catch (error) {
                transaction.rollback();
                throw error;
            }
            return entities;
        }
        catch (error) {
            logger_1.logger.error('Failed to extract entities', error);
            throw error;
        }
    }
    async calculateDocumentSimilarity(document1Id, document2Id) {
        try {
            const document1 = await document_service_1.documentService.getDocumentById(document1Id);
            const document2 = await document_service_1.documentService.getDocumentById(document2Id);
            if (!document1 || !document2) {
                return null;
            }
            const similarity = Math.random();
            const now = new Date().toISOString();
            this.db.run(`
        INSERT OR REPLACE INTO document_similarities (
          document1_id, document2_id, similarity, created_at
        ) VALUES (?, ?, ?, ?)
      `, [document1Id, document2Id, similarity, now]);
            return {
                document1Id,
                document2Id,
                similarity,
                created_at: now
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to calculate document similarity', error);
            throw error;
        }
    }
    async predictCategory(documentId) {
        try {
            const document = await document_service_1.documentService.getDocumentById(documentId);
            if (!document) {
                return null;
            }
            const categories = [
                'قانون اساسی', 'قوانین مدنی', 'قوانین تجاری',
                'قوانین کیفری', 'آیین‌نامه', 'بخشنامه', 'مصوبه'
            ];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const confidence = 0.7 + Math.random() * 0.3;
            const now = new Date().toISOString();
            this.db.run(`
        INSERT OR REPLACE INTO document_categories (
          document_id, category, confidence, analyzed_at
        ) VALUES (?, ?, ?, ?)
      `, [documentId, category, confidence, now]);
            return {
                documentId,
                category,
                confidence,
                analyzed_at: now
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to predict document category', error);
            throw error;
        }
    }
    async generateTopics(name, documentIds) {
        try {
            const documents = await Promise.all(documentIds.map(id => document_service_1.documentService.getDocumentById(id)));
            const validDocuments = documents.filter(doc => doc !== null);
            if (validDocuments.length === 0) {
                return null;
            }
            const id = (0, uuid_1.v4)();
            const now = new Date().toISOString();
            const topicCount = 3 + Math.floor(Math.random() * 3);
            const topics = Array.from({ length: topicCount }).map((_, index) => {
                return {
                    id: (0, uuid_1.v4)(),
                    name: `Topic ${index + 1}`,
                    keywords: Array.from({ length: 5 }).map((_, i) => `keyword${index}_${i}`),
                    weight: Math.random()
                };
            });
            const totalWeight = topics.reduce((sum, topic) => sum + topic.weight, 0);
            topics.forEach(topic => topic.weight = topic.weight / totalWeight);
            const transaction = this.db.transaction();
            try {
                transaction.begin();
                this.db.run(`
          INSERT INTO topic_models (
            id, name, created_at
          ) VALUES (?, ?, ?)
        `, [id, name, now]);
                for (const topic of topics) {
                    this.db.run(`
            INSERT INTO topics (
              id, model_id, name, keywords, weight
            ) VALUES (?, ?, ?, ?, ?)
          `, [
                        topic.id,
                        id,
                        topic.name,
                        JSON.stringify(topic.keywords),
                        topic.weight
                    ]);
                }
                for (const document of validDocuments) {
                    const docTopics = topics.map(topic => ({
                        topicId: topic.id,
                        weight: Math.random()
                    }));
                    const totalDocWeight = docTopics.reduce((sum, t) => sum + t.weight, 0);
                    docTopics.forEach(t => t.weight = t.weight / totalDocWeight);
                    docTopics.sort((a, b) => b.weight - a.weight);
                    for (let i = 0; i < Math.min(2, docTopics.length); i++) {
                        this.db.run(`
              INSERT INTO document_topics (
                document_id, topic_id, weight
              ) VALUES (?, ?, ?)
            `, [
                            document.id,
                            docTopics[i].topicId,
                            docTopics[i].weight
                        ]);
                    }
                }
                transaction.commit();
            }
            catch (error) {
                transaction.rollback();
                throw error;
            }
            return {
                id,
                name,
                created_at: now,
                topics
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to generate topics', error);
            throw error;
        }
    }
    async analyzeDocument(documentId) {
        try {
            (0, websocket_controller_1.emitSystemEvent)('analytics_started', {
                documentId,
                timestamp: new Date().toISOString()
            });
            const [sentiment, entities, category] = await Promise.all([
                this.calculateSentiment(documentId),
                this.extractEntities(documentId),
                this.predictCategory(documentId)
            ]);
            if (category && category.confidence > 0.8) {
                await document_service_1.documentService.updateDocument(documentId, { category: category.category }, 'system');
            }
            (0, websocket_controller_1.emitSystemEvent)('analytics_completed', {
                documentId,
                sentiment: sentiment?.score,
                entityCount: entities.length,
                category: category?.category,
                timestamp: new Date().toISOString()
            });
            return {
                sentiment,
                entities,
                category
            };
        }
        catch (error) {
            (0, websocket_controller_1.emitSystemEvent)('analytics_failed', {
                documentId,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            logger_1.logger.error(`Failed to analyze document ${documentId}`, error);
            throw error;
        }
    }
}
exports.analyticsService = new AnalyticsService();
//# sourceMappingURL=analytics.service.js.map