import { v4 as uuidv4 } from 'uuid';
import { databaseService } from './database.service';
import { documentService } from './document.service';
import { logger } from '@utils/logger';
import { emitSystemEvent } from '@controllers/websocket.controller';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  period: 'day' | 'week' | 'month' | 'year' | 'all';
  dimension?: string | null;
  created_at: string;
}

interface DocumentSentiment {
  documentId: string;
  score: number; // -1 to 1, negative to positive
  confidence: number;
  analyzed_at: string;
}

interface EntityExtraction {
  documentId: string;
  entity: string;
  type: string;
  count: number;
  confidence: number;
  analyzed_at: string;
}

interface DocumentSimilarity {
  document1Id: string;
  document2Id: string;
  similarity: number; // 0 to 1
  created_at: string;
}

interface CategoryPrediction {
  documentId: string;
  category: string;
  confidence: number;
  analyzed_at: string;
}

interface TopicModel {
  id: string;
  name: string;
  created_at: string;
  topics: {
    id: string;
    name: string;
    keywords: string[];
    weight: number;
  }[];
}

class AnalyticsService {
  private db = databaseService.getClient();
  
  /**
   * Get dashboard metrics for the given period
   */
  async getDashboardMetrics(
    period: 'day' | 'week' | 'month' | 'year' = 'week'
  ): Promise<AnalyticsMetric[]> {
    try {
      const metrics = this.db.query<AnalyticsMetric>(`
        SELECT * FROM analytics_metrics
        WHERE period = ?
        ORDER BY created_at DESC
      `, [period]);
      
      return metrics;
    } catch (error) {
      logger.error('Failed to get dashboard metrics', error);
      throw error;
    }
  }
  
  /**
   * Calculate document sentiment
   */
  async calculateSentiment(documentId: string): Promise<DocumentSentiment | null> {
    try {
      const document = await documentService.getDocumentById(documentId);
      if (!document) {
        return null;
      }
      
      // In a real implementation, this would use a sentiment analysis library or API
      // For now, simulate sentiment analysis with random values
      const sentimentScore = Math.random() * 2 - 1; // -1 to 1
      const confidence = 0.7 + Math.random() * 0.3; // 0.7 to 1.0
      
      const now = new Date().toISOString();
      
      // Store sentiment in database
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
    } catch (error) {
      logger.error('Failed to calculate document sentiment', error);
      throw error;
    }
  }
  
  /**
   * Extract entities from a document
   */
  async extractEntities(documentId: string): Promise<EntityExtraction[]> {
    try {
      const document = await documentService.getDocumentById(documentId);
      if (!document) {
        return [];
      }
      
      // In a real implementation, this would use NER (Named Entity Recognition)
      // For now, simulate entity extraction
      const now = new Date().toISOString();
      const content = document.content.toLowerCase();
      
      // Simple entity detection with predefined patterns (simplified for example)
      const entities: EntityExtraction[] = [];
      
      // Simplified entity detection for demonstration
      const entityPatterns = [
        { regex: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, type: 'DATE' },
        { regex: /\b\d+\s*(ریال|تومان)\b/g, type: 'MONEY' },
        { regex: /\bماده\s*\d+\b/g, type: 'LEGAL_REFERENCE' },
        { regex: /\bقانون\s+[\u0600-\u06FF\s]{3,50}?\b/g, type: 'LAW' },
        { regex: /\b(تهران|مشهد|اصفهان|شیراز|تبریز)\b/g, type: 'LOCATION' }
      ];
      
      // Check Persian and English content
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
      
      // Store entities in database
      const transaction = this.db.transaction();
      try {
        transaction.begin();
        
        // Clear previous entities for this document
        this.db.run(`
          DELETE FROM document_entities
          WHERE document_id = ?
        `, [documentId]);
        
        // Insert new entities
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
      } catch (error) {
        transaction.rollback();
        throw error;
      }
      
      return entities;
    } catch (error) {
      logger.error('Failed to extract entities', error);
      throw error;
    }
  }
  
  /**
   * Calculate similarity between two documents
   */
  async calculateDocumentSimilarity(
    document1Id: string,
    document2Id: string
  ): Promise<DocumentSimilarity | null> {
    try {
      const document1 = await documentService.getDocumentById(document1Id);
      const document2 = await documentService.getDocumentById(document2Id);
      
      if (!document1 || !document2) {
        return null;
      }
      
      // In a real implementation, this would use document embeddings and cosine similarity
      // For now, simulate similarity with random value
      const similarity = Math.random();
      const now = new Date().toISOString();
      
      // Store similarity in database
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
    } catch (error) {
      logger.error('Failed to calculate document similarity', error);
      throw error;
    }
  }
  
  /**
   * Predict document category
   */
  async predictCategory(documentId: string): Promise<CategoryPrediction | null> {
    try {
      const document = await documentService.getDocumentById(documentId);
      if (!document) {
        return null;
      }
      
      // In a real implementation, this would use a classifier model
      // For now, simulate category prediction
      const categories = [
        'قانون اساسی', 'قوانین مدنی', 'قوانین تجاری', 
        'قوانین کیفری', 'آیین‌نامه', 'بخشنامه', 'مصوبه'
      ];
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const confidence = 0.7 + Math.random() * 0.3;
      const now = new Date().toISOString();
      
      // Store prediction in database
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
    } catch (error) {
      logger.error('Failed to predict document category', error);
      throw error;
    }
  }
  
  /**
   * Generate topics from a set of documents
   */
  async generateTopics(
    name: string,
    documentIds: string[]
  ): Promise<TopicModel | null> {
    try {
      const documents = await Promise.all(
        documentIds.map(id => documentService.getDocumentById(id))
      );
      
      const validDocuments = documents.filter(doc => doc !== null);
      
      if (validDocuments.length === 0) {
        return null;
      }
      
      // In a real implementation, this would use topic modeling like LDA
      // For now, simulate topic generation
      const id = uuidv4();
      const now = new Date().toISOString();
      
      // Generate 3-5 topics
      const topicCount = 3 + Math.floor(Math.random() * 3);
      const topics = Array.from({ length: topicCount }).map((_, index) => {
        return {
          id: uuidv4(),
          name: `Topic ${index + 1}`,
          keywords: Array.from({ length: 5 }).map((_, i) => 
            `keyword${index}_${i}`
          ),
          weight: Math.random()
        };
      });
      
      // Normalize weights
      const totalWeight = topics.reduce((sum, topic) => sum + topic.weight, 0);
      topics.forEach(topic => topic.weight = topic.weight / totalWeight);
      
      // Store topic model
      const transaction = this.db.transaction();
      try {
        transaction.begin();
        
        // Insert topic model
        this.db.run(`
          INSERT INTO topic_models (
            id, name, created_at
          ) VALUES (?, ?, ?)
        `, [id, name, now]);
        
        // Insert topics
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
        
        // Insert document-topic relationships
        for (const document of validDocuments) {
          // Assign random topic weights to each document
          const docTopics = topics.map(topic => ({
            topicId: topic.id,
            weight: Math.random()
          }));
          
          // Normalize weights
          const totalDocWeight = docTopics.reduce((sum, t) => sum + t.weight, 0);
          docTopics.forEach(t => t.weight = t.weight / totalDocWeight);
          
          // Store top 2 topics for each document
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
      } catch (error) {
        transaction.rollback();
        throw error;
      }
      
      return {
        id,
        name,
        created_at: now,
        topics
      };
    } catch (error) {
      logger.error('Failed to generate topics', error);
      throw error;
    }
  }
  
  /**
   * Analyze a document with all available analytics
   */
  async analyzeDocument(documentId: string): Promise<{
    sentiment: DocumentSentiment | null;
    entities: EntityExtraction[];
    category: CategoryPrediction | null;
  }> {
    try {
      // Emit event for analytics start
      emitSystemEvent('analytics_started', {
        documentId,
        timestamp: new Date().toISOString()
      });
      
      // Run all analyses in parallel
      const [sentiment, entities, category] = await Promise.all([
        this.calculateSentiment(documentId),
        this.extractEntities(documentId),
        this.predictCategory(documentId)
      ]);
      
      // Update document with category if predicted with high confidence
      if (category && category.confidence > 0.8) {
        await documentService.updateDocument(
          documentId,
          { category: category.category },
          'system'
        );
      }
      
      // Emit event for analytics completion
      emitSystemEvent('analytics_completed', {
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
    } catch (error) {
      // Emit event for analytics failure
      emitSystemEvent('analytics_failed', {
        documentId,
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      });
      
      logger.error(`Failed to analyze document ${documentId}`, error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
