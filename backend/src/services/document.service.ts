import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { databaseService } from './database.service';
import {
    DocumentRecord,
    DocumentVersion
} from '@models/document.model';
import { logger } from '@utils/logger';
import { emitDocumentEvent } from '@controllers/websocket.controller';
import { DocumentRecordRaw, DocumentVersionRaw } from '../types/database.types';

class DocumentService {
    private db = databaseService.getClient();

    /**
     * Create a new document
     */
    async createDocument(data: Partial<DocumentRecord>, userId: string): Promise<DocumentRecord> {
        const now = new Date().toISOString();
        const id = uuidv4();
        const version = 1;
        const content = data.content || '';
        const hash = this.generateContentHash(content);

        const document: DocumentRecord = {
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

            // Insert document
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

            // Create initial version
            this.db.run(`
        INSERT INTO document_versions (
          id, document_id, version, title, content, metadata, hash, 
          created_at, created_by, change_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                uuidv4(), document.id, document.version, document.title,
                document.content, JSON.stringify(document.metadata), document.hash,
                document.created_at, document.created_by, 'Initial version'
            ]);

            transaction.commit();

            // Emit websocket event
            emitDocumentEvent(document.id, 'document_created', {
                id: document.id,
                title: document.title,
                createdBy: document.created_by
            });

            return document;
        } catch (error) {
            transaction.rollback();
            logger.error('Failed to create document', error);
            throw error;
        }
    }

    /**
     * Get a document by ID
     */
    async getDocumentById(id: string): Promise<DocumentRecord | null> {
        try {
            const document = this.db.query<DocumentRecord>(`
        SELECT * FROM documents WHERE id = ?
      `, [id])[0];

            if (!document) {
                return null;
            }

            // Parse JSON fields
            return {
                ...document,
                keywords: JSON.parse(document.keywords as unknown as string),
                metadata: JSON.parse(document.metadata as unknown as string)
            };
        } catch (error) {
            logger.error('Failed to get document', error);
            throw error;
        }
    }

    /**
     * Update a document
     */
    async updateDocument(
        id: string,
        data: Partial<DocumentRecord>,
        userId: string
    ): Promise<DocumentRecord | null> {
        const now = new Date().toISOString();

        try {
            // Get current document
            const currentDocument = await this.getDocumentById(id);
            if (!currentDocument) {
                return null;
            }

            // Calculate new version number if content changed
            const newContent = data.content || currentDocument.content;
            const contentChanged = newContent !== currentDocument.content;
            const newHash = contentChanged ?
                this.generateContentHash(newContent) :
                currentDocument.hash;
            const newVersion = contentChanged ?
                currentDocument.version + 1 :
                currentDocument.version;

            // Prepare updated document data
            const updatedDocument: DocumentRecord = {
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

                // Update document
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

                // Create new version if content changed
                if (contentChanged) {
                    const changeSummary = data.metadata?.changeSummary || 'Document updated';

                    this.db.run(`
            INSERT INTO document_versions (
              id, document_id, version, title, content, metadata, hash,
              created_at, created_by, change_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
                        uuidv4(), id, updatedDocument.version, updatedDocument.title,
                        updatedDocument.content, JSON.stringify(updatedDocument.metadata),
                        updatedDocument.hash, now, userId, changeSummary
                    ]);
                }

                transaction.commit();

                // Emit websocket event
                emitDocumentEvent(id, 'document_updated', {
                    id,
                    title: updatedDocument.title,
                    version: updatedDocument.version,
                    updatedBy: userId
                });

                return updatedDocument;
            } catch (error) {
                transaction.rollback();
                throw error;
            }
        } catch (error) {
            logger.error('Failed to update document', error);
            throw error;
        }
    }

    /**
     * Delete a document
     */
    async deleteDocument(id: string): Promise<boolean> {
        try {
            const document = await this.getDocumentById(id);
            if (!document) {
                return false;
            }

            const transaction = this.db.transaction();
            try {
                transaction.begin();

                // Delete document (triggers will handle FTS)
                this.db.run(`DELETE FROM documents WHERE id = ?`, [id]);

                transaction.commit();

                // Emit websocket event
                emitDocumentEvent(id, 'document_deleted', {
                    id,
                    title: document.title
                });

                return true;
            } catch (error) {
                transaction.rollback();
                throw error;
            }
        } catch (error) {
            logger.error('Failed to delete document', error);
            throw error;
        }
    }

    /**
     * List documents with pagination
     */
    async listDocuments(options: {
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
        source?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{ items: DocumentRecord[]; total: number; page: number; pageCount: number }> {
        const {
            page = 1,
            limit = 20,
            status,
            category,
            source,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = options;

        const offset = (page - 1) * limit;

        try {
            // Build where clause
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

            // Get total count
            const countResult = this.db.query<{ count: number }>(`
        SELECT COUNT(*) as count FROM documents ${whereClause}
      `, whereParams);

            const total = countResult[0].count;

            // Get paginated results
            const validSortColumns = [
                'title', 'created_at', 'updated_at', 'published_at',
                'version', 'category', 'source', 'score'
            ];
            const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
            const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

            const results = this.db.query<DocumentRecordRaw>(`
        SELECT * FROM documents
        ${whereClause}
        ORDER BY ${sortColumn} ${order}
        LIMIT ? OFFSET ?
      `, [...whereParams, limit, offset]);

            // Parse JSON fields
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
        } catch (error) {
            logger.error('Failed to list documents', error);
            throw error;
        }
    }

    /**
     * Search documents using FTS
     */
    async searchDocuments(query: string, options: {
        page?: number;
        limit?: number;
        highlightStart?: string;
        highlightEnd?: string;
        status?: string;
    } = {}): Promise<{
        results: Array<DocumentRecord & { snippet: string; rank: number }>;
        total: number;
        page: number;
        pageCount: number;
    }> {
        const {
            page = 1,
            limit = 20,
            highlightStart = '<em>',
            highlightEnd = '</em>',
            status
        } = options;

        const offset = (page - 1) * limit;

        try {
            // Build where clause for status filter
            const whereConditions = [];
            const whereParams = [query];

            if (status) {
                whereConditions.push('d.status = ?');
                whereParams.push(status);
            }

            const whereClause = whereConditions.length > 0
                ? `AND ${whereConditions.join(' AND ')}`
                : '';

            // Get total count
            const countResult = this.db.query<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM documents_fts fts
        JOIN documents d ON fts.rowid = d.id
        WHERE documents_fts MATCH ?
        ${whereClause}
      `, whereParams);

            const total = countResult[0]?.count || 0;

            // Execute search with snippet highlighting
            const results = this.db.query<DocumentRecordRaw & { title_snippet: string; content_snippet: string; rank: number }>(`
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

            // Process results
            const searchResults = results.map(item => {
                // Combine snippets
                const titleSnippet = item.title_snippet || item.title;
                const contentSnippet = item.content_snippet || item.content.substring(0, 100) + '...';
                const snippet = `${titleSnippet} - ${contentSnippet}`;

                // Parse JSON fields
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
        } catch (error) {
            logger.error('Failed to search documents', error);
            throw error;
        }
    }

    /**
     * Get document version history
     */
    async getDocumentVersions(
        documentId: string
    ): Promise<DocumentVersion[]> {
        try {
            const versions = this.db.query<DocumentVersionRaw>(`
        SELECT * FROM document_versions
        WHERE document_id = ?
        ORDER BY version DESC
      `, [documentId]);

            return versions.map(v => ({
                ...v,
                metadata: JSON.parse(v.metadata)
            }));
        } catch (error) {
            logger.error('Failed to get document versions', error);
            throw error;
        }
    }

    /**
     * Get a specific document version
     */
    async getDocumentVersion(
        documentId: string,
        version: number
    ): Promise<DocumentVersion | null> {
        try {
            const docVersion = this.db.query<DocumentVersionRaw>(`
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
        } catch (error) {
            logger.error('Failed to get document version', error);
            throw error;
        }
    }

    /**
     * Revert document to a specific version
     */
    async revertToVersion(
        documentId: string,
        version: number,
        userId: string
    ): Promise<DocumentRecord | null> {
        try {
            // Get the version to revert to
            const targetVersion = await this.getDocumentVersion(documentId, version);
            if (!targetVersion) {
                return null;
            }

            // Get current document
            const currentDocument = await this.getDocumentById(documentId);
            if (!currentDocument) {
                return null;
            }

            // Update document with version data
            return this.updateDocument(documentId, {
                title: targetVersion.title,
                content: targetVersion.content,
                metadata: {
                    ...targetVersion.metadata,
                    revertedFromVersion: version,
                    changeSummary: `Reverted to version ${version}`
                }
            }, userId);
        } catch (error) {
            logger.error('Failed to revert document version', error);
            throw error;
        }
    }

    /**
     * List document categories
     */
    async getCategories(): Promise<string[]> {
        try {
            const categories = this.db.query<{ category: string }>(`
        SELECT DISTINCT category FROM documents
        WHERE category IS NOT NULL AND category != ''
        ORDER BY category
      `);

            return categories.map(c => c.category);
        } catch (error) {
            logger.error('Failed to get document categories', error);
            throw error;
        }
    }

    /**
     * List document sources
     */
    async getSources(): Promise<string[]> {
        try {
            const sources = this.db.query<{ source: string }>(`
        SELECT DISTINCT source FROM documents
        WHERE source IS NOT NULL AND source != ''
        ORDER BY source
      `);

            return sources.map(s => s.source);
        } catch (error) {
            logger.error('Failed to get document sources', error);
            throw error;
        }
    }

    /**
     * Generate content hash for change detection
     */
    private generateContentHash(content: string): string {
        return crypto.createHash('sha256').update(content).digest('hex');
    }
}

export const documentService = new DocumentService();
