"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentService = void 0;
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const database_service_1 = require("./database.service");
const logger_1 = require("../utils/logger");
const websocket_controller_1 = require("../controllers/websocket.controller");
class DocumentService {
    constructor() {
        this.db = database_service_1.databaseService.getClient();
    }
    async createDocument(data, userId) {
        const now = new Date().toISOString();
        const id = (0, uuid_1.v4)();
        const version = 1;
        const content = data.content || '';
        const hash = this.generateContentHash(content);
        const document = {
            id,
            title: data.title || 'Untitled Document',
            content,
            category: data.category || null,
            source: data.source || null,
            score: data.score || null,
            status: data.status || 'draft',
            language: data.language || null,
            keywords: data.keywords || [],
            metadata: data.metadata || {},
            version,
            hash,
            created_at: now,
            updated_at: null,
            published_at: null,
            archived_at: null,
            created_by: userId,
            updated_by: null,
        };
        const transaction = this.db.transaction();
        try {
            transaction.begin();
            this.db.run(`
        INSERT INTO documents (
          id, title, content, category, source, score, status, language, 
          keywords, metadata, version, hash, created_at, updated_at,
          published_at, archived_at, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                document.id, document.title, document.content, document.category,
                document.source, document.score, document.status, document.language,
                JSON.stringify(document.keywords), JSON.stringify(document.metadata),
                document.version, document.hash, document.created_at, document.updated_at,
                document.published_at, document.archived_at, document.created_by,
                document.updated_by
            ]);
            this.db.run(`
        INSERT INTO document_versions (
          id, document_id, version, title, content, metadata, hash, 
          created_at, created_by, change_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                (0, uuid_1.v4)(), document.id, document.version, document.title,
                document.content, JSON.stringify(document.metadata), document.hash,
                document.created_at, document.created_by, 'Initial version'
            ]);
            transaction.commit();
            (0, websocket_controller_1.emitDocumentEvent)(document.id, 'document_created', {
                id: document.id,
                title: document.title,
                createdBy: document.created_by
            });
            return document;
        }
        catch (error) {
            transaction.rollback();
            logger_1.logger.error('Failed to create document', error);
            throw error;
        }
    }
    async getDocumentById(id) {
        try {
            const document = this.db.query(`
        SELECT * FROM documents WHERE id = ?
      `, [id])[0];
            if (!document) {
                return null;
            }
            return {
                ...document,
                keywords: JSON.parse(document.keywords),
                metadata: JSON.parse(document.metadata)
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get document', error);
            throw error;
        }
    }
    async updateDocument(id, data, userId) {
        const now = new Date().toISOString();
        try {
            const currentDocument = await this.getDocumentById(id);
            if (!currentDocument) {
                return null;
            }
            const newContent = data.content || currentDocument.content;
            const contentChanged = newContent !== currentDocument.content;
            const newHash = contentChanged ?
                this.generateContentHash(newContent) :
                currentDocument.hash;
            const newVersion = contentChanged ?
                currentDocument.version + 1 :
                currentDocument.version;
            const updatedDocument = {
                ...currentDocument,
                title: data.title || currentDocument.title,
                content: newContent,
                category: data.category !== undefined ? data.category : currentDocument.category,
                source: data.source !== undefined ? data.source : currentDocument.source,
                score: data.score !== undefined ? data.score : currentDocument.score,
                status: data.status || currentDocument.status,
                language: data.language !== undefined ? data.language : currentDocument.language,
                keywords: data.keywords || currentDocument.keywords,
                metadata: {
                    ...currentDocument.metadata,
                    ...(data.metadata || {})
                },
                version: newVersion,
                hash: newHash,
                updated_at: now,
                updated_by: userId,
                published_at: data.status === 'published' && currentDocument.status !== 'published' ?
                    now : currentDocument.published_at,
                archived_at: data.status === 'archived' && currentDocument.status !== 'archived' ?
                    now : currentDocument.archived_at,
            };
            const transaction = this.db.transaction();
            try {
                transaction.begin();
                this.db.run(`
          UPDATE documents SET
            title = ?, content = ?, category = ?, source = ?,
            score = ?, status = ?, language = ?, keywords = ?,
            metadata = ?, version = ?, hash = ?, updated_at = ?,
            published_at = ?, archived_at = ?, updated_by = ?
          WHERE id = ?
        `, [
                    updatedDocument.title, updatedDocument.content, updatedDocument.category,
                    updatedDocument.source, updatedDocument.score, updatedDocument.status,
                    updatedDocument.language, JSON.stringify(updatedDocument.keywords),
                    JSON.stringify(updatedDocument.metadata), updatedDocument.version,
                    updatedDocument.hash, updatedDocument.updated_at, updatedDocument.published_at,
                    updatedDocument.archived_at, updatedDocument.updated_by, id
                ]);
                if (contentChanged) {
                    const changeSummary = data.metadata?.changeSummary || 'Document updated';
                    this.db.run(`
            INSERT INTO document_versions (
              id, document_id, version, title, content, metadata, hash,
              created_at, created_by, change_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
                        (0, uuid_1.v4)(), id, updatedDocument.version, updatedDocument.title,
                        updatedDocument.content, JSON.stringify(updatedDocument.metadata),
                        updatedDocument.hash, now, userId, changeSummary
                    ]);
                }
                transaction.commit();
                (0, websocket_controller_1.emitDocumentEvent)(id, 'document_updated', {
                    id,
                    title: updatedDocument.title,
                    version: updatedDocument.version,
                    updatedBy: userId
                });
                return updatedDocument;
            }
            catch (error) {
                transaction.rollback();
                throw error;
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to update document', error);
            throw error;
        }
    }
    async deleteDocument(id) {
        try {
            const document = await this.getDocumentById(id);
            if (!document) {
                return false;
            }
            const transaction = this.db.transaction();
            try {
                transaction.begin();
                this.db.run(`DELETE FROM documents WHERE id = ?`, [id]);
                transaction.commit();
                (0, websocket_controller_1.emitDocumentEvent)(id, 'document_deleted', {
                    id,
                    title: document.title
                });
                return true;
            }
            catch (error) {
                transaction.rollback();
                throw error;
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to delete document', error);
            throw error;
        }
    }
    async listDocuments(options) {
        const { page = 1, limit = 20, status, category, source, sortBy = 'created_at', sortOrder = 'desc' } = options;
        const offset = (page - 1) * limit;
        try {
            const whereConditions = [];
            const whereParams = [];
            if (status) {
                whereConditions.push('status = ?');
                whereParams.push(status);
            }
            if (category) {
                whereConditions.push('category = ?');
                whereParams.push(category);
            }
            if (source) {
                whereConditions.push('source = ?');
                whereParams.push(source);
            }
            const whereClause = whereConditions.length > 0
                ? `WHERE ${whereConditions.join(' AND ')}`
                : '';
            const countResult = this.db.query(`
        SELECT COUNT(*) as count FROM documents ${whereClause}
      `, whereParams);
            const total = countResult[0].count;
            const validSortColumns = [
                'title', 'created_at', 'updated_at', 'published_at',
                'version', 'category', 'source', 'score'
            ];
            const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
            const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
            const results = this.db.query(`
        SELECT * FROM documents
        ${whereClause}
        ORDER BY ${sortColumn} ${order}
        LIMIT ? OFFSET ?
      `, [...whereParams, limit, offset]);
            const items = results.map(item => ({
                ...item,
                keywords: JSON.parse(item.keywords),
                metadata: JSON.parse(item.metadata)
            }));
            return {
                items,
                total,
                page,
                pageCount: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to list documents', error);
            throw error;
        }
    }
    async searchDocuments(query, options = {}) {
        const { page = 1, limit = 20, highlightStart = '<em>', highlightEnd = '</em>', status } = options;
        const offset = (page - 1) * limit;
        try {
            const whereConditions = [];
            const whereParams = [query];
            if (status) {
                whereConditions.push('d.status = ?');
                whereParams.push(status);
            }
            const whereClause = whereConditions.length > 0
                ? `AND ${whereConditions.join(' AND ')}`
                : '';
            const countResult = this.db.query(`
        SELECT COUNT(*) as count
        FROM documents_fts fts
        JOIN documents d ON fts.rowid = d.id
        WHERE documents_fts MATCH ?
        ${whereClause}
      `, whereParams);
            const total = countResult[0]?.count || 0;
            const results = this.db.query(`
        SELECT 
          d.*,
          snippet(documents_fts, 0, ?, ?, '...', 64) as title_snippet,
          snippet(documents_fts, 1, ?, ?, '...', 64) as content_snippet,
          rank
        FROM (
          SELECT
            rowid,
            rank
          FROM documents_fts
          WHERE documents_fts MATCH ?
          ORDER BY rank
          LIMIT ? OFFSET ?
        ) AS s
        JOIN documents d ON s.rowid = d.id
        JOIN documents_fts fts ON fts.rowid = d.id
        ${whereClause.length > 0 ? `WHERE ${whereClause.slice(4)}` : ''}
        ORDER BY rank
      `, [
                highlightStart, highlightEnd,
                highlightStart, highlightEnd,
                query, limit, offset,
                ...(whereClause ? whereParams.slice(1) : [])
            ]);
            const searchResults = results.map(item => {
                const titleSnippet = item.title_snippet || item.title;
                const contentSnippet = item.content_snippet || item.content.substring(0, 100) + '...';
                const snippet = `${titleSnippet} - ${contentSnippet}`;
                return {
                    ...item,
                    keywords: JSON.parse(item.keywords),
                    metadata: JSON.parse(item.metadata),
                    snippet,
                    rank: item.rank
                };
            });
            return {
                results: searchResults,
                total,
                page,
                pageCount: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to search documents', error);
            throw error;
        }
    }
    async getDocumentVersions(documentId) {
        try {
            const versions = this.db.query(`
        SELECT * FROM document_versions
        WHERE document_id = ?
        ORDER BY version DESC
      `, [documentId]);
            return versions.map(v => ({
                ...v,
                metadata: JSON.parse(v.metadata)
            }));
        }
        catch (error) {
            logger_1.logger.error('Failed to get document versions', error);
            throw error;
        }
    }
    async getDocumentVersion(documentId, version) {
        try {
            const docVersion = this.db.query(`
        SELECT * FROM document_versions
        WHERE document_id = ? AND version = ?
      `, [documentId, version])[0];
            if (!docVersion) {
                return null;
            }
            return {
                ...docVersion,
                metadata: JSON.parse(docVersion.metadata)
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get document version', error);
            throw error;
        }
    }
    async revertToVersion(documentId, version, userId) {
        try {
            const targetVersion = await this.getDocumentVersion(documentId, version);
            if (!targetVersion) {
                return null;
            }
            const currentDocument = await this.getDocumentById(documentId);
            if (!currentDocument) {
                return null;
            }
            return this.updateDocument(documentId, {
                title: targetVersion.title,
                content: targetVersion.content,
                metadata: {
                    ...targetVersion.metadata,
                    revertedFromVersion: version,
                    changeSummary: `Reverted to version ${version}`
                }
            }, userId);
        }
        catch (error) {
            logger_1.logger.error('Failed to revert document version', error);
            throw error;
        }
    }
    async getCategories() {
        try {
            const categories = this.db.query(`
        SELECT DISTINCT category FROM documents
        WHERE category IS NOT NULL AND category != ''
        ORDER BY category
      `);
            return categories.map(c => c.category);
        }
        catch (error) {
            logger_1.logger.error('Failed to get document categories', error);
            throw error;
        }
    }
    async getSources() {
        try {
            const sources = this.db.query(`
        SELECT DISTINCT source FROM documents
        WHERE source IS NOT NULL AND source != ''
        ORDER BY source
      `);
            return sources.map(s => s.source);
        }
        catch (error) {
            logger_1.logger.error('Failed to get document sources', error);
            throw error;
        }
    }
    generateContentHash(content) {
        return crypto_1.default.createHash('sha256').update(content).digest('hex');
    }
}
exports.documentService = new DocumentService();
//# sourceMappingURL=document.service.js.map