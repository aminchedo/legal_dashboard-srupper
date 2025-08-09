"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const document_service_1 = require("../../services/document.service");
globals_1.jest.mock('@services/database.service', () => {
    const mockClient = {
        query: globals_1.jest.fn(),
        run: globals_1.jest.fn(),
        transaction: globals_1.jest.fn().mockReturnValue({
            begin: globals_1.jest.fn(),
            commit: globals_1.jest.fn(),
            rollback: globals_1.jest.fn()
        })
    };
    return {
        databaseService: {
            getClient: () => mockClient
        }
    };
});
globals_1.jest.mock('@controllers/websocket.controller', () => ({
    emitDocumentEvent: globals_1.jest.fn()
}));
const mockDb = globals_1.jest.requireMock('@services/database.service').databaseService.getClient();
(0, globals_1.describe)('Document Service', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterEach)(() => {
        globals_1.jest.resetAllMocks();
    });
    (0, globals_1.describe)('createDocument', () => {
        (0, globals_1.test)('should create a new document with default values', async () => {
            const documentData = {
                title: 'Test Document',
                content: 'Test content'
            };
            const userId = 'user-123';
            await document_service_1.documentService.createDocument(documentData, userId);
            (0, globals_1.expect)(mockDb.run).toHaveBeenCalledTimes(2);
            (0, globals_1.expect)(mockDb.transaction().begin).toHaveBeenCalled();
            (0, globals_1.expect)(mockDb.transaction().commit).toHaveBeenCalled();
            const runCall = mockDb.run.mock.calls[0];
            (0, globals_1.expect)(runCall[1].length).toBe(18);
        });
        (0, globals_1.test)('should handle errors and rollback transaction', async () => {
            const documentData = {
                title: 'Test Document',
                content: 'Test content'
            };
            const userId = 'user-123';
            mockDb.run.mockImplementationOnce(() => {
                throw new Error('Database error');
            });
            await (0, globals_1.expect)(document_service_1.documentService.createDocument(documentData, userId)).rejects.toThrow('Database error');
            (0, globals_1.expect)(mockDb.transaction().begin).toHaveBeenCalled();
            (0, globals_1.expect)(mockDb.transaction().rollback).toHaveBeenCalled();
            (0, globals_1.expect)(mockDb.transaction().commit).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('getDocumentById', () => {
        (0, globals_1.test)('should return document if found', async () => {
            const mockDocument = {
                id: 'doc-123',
                title: 'Test Document',
                content: 'Test content',
                keywords: '[]',
                metadata: '{}'
            };
            mockDb.query.mockReturnValueOnce([mockDocument]);
            const result = await document_service_1.documentService.getDocumentById('doc-123');
            (0, globals_1.expect)(result).not.toBeNull();
            (0, globals_1.expect)(result?.id).toBe('doc-123');
            (0, globals_1.expect)(mockDb.query).toHaveBeenCalled();
            (0, globals_1.expect)(mockDb.query.mock.calls[0][1]).toEqual(['doc-123']);
        });
        (0, globals_1.test)('should return null if document not found', async () => {
            mockDb.query.mockReturnValueOnce([]);
            const result = await document_service_1.documentService.getDocumentById('non-existent');
            (0, globals_1.expect)(result).toBeNull();
        });
    });
    (0, globals_1.describe)('updateDocument', () => {
        (0, globals_1.test)('should update document and create new version if content changed', async () => {
            const originalDocument = {
                id: 'doc-123',
                title: 'Original Title',
                content: 'Original content',
                category: null,
                source: null,
                score: null,
                status: 'draft',
                language: null,
                keywords: [],
                metadata: {},
                version: 1,
                hash: 'old-hash',
                created_at: '2023-01-01T00:00:00Z',
                updated_at: null,
                published_at: null,
                archived_at: null,
                created_by: 'user-123',
                updated_by: null
            };
            globals_1.jest.spyOn(document_service_1.documentService, 'getDocumentById').mockResolvedValueOnce(originalDocument);
            await document_service_1.documentService.updateDocument('doc-123', {
                title: 'Updated Title',
                content: 'Updated content'
            }, 'user-456');
            (0, globals_1.expect)(mockDb.run).toHaveBeenCalledTimes(2);
            (0, globals_1.expect)(mockDb.transaction().begin).toHaveBeenCalled();
            (0, globals_1.expect)(mockDb.transaction().commit).toHaveBeenCalled();
        });
        (0, globals_1.test)('should handle errors during update', async () => {
            const originalDocument = {
                id: 'doc-123',
                title: 'Original Title',
                content: 'Original content',
                category: null,
                source: null,
                score: null,
                status: 'draft',
                language: null,
                keywords: [],
                metadata: {},
                version: 1,
                hash: 'old-hash',
                created_at: '2023-01-01T00:00:00Z',
                updated_at: null,
                published_at: null,
                archived_at: null,
                created_by: 'user-123',
                updated_by: null
            };
            globals_1.jest.spyOn(document_service_1.documentService, 'getDocumentById').mockResolvedValueOnce(originalDocument);
            mockDb.run.mockImplementationOnce(() => {
                throw new Error('Update error');
            });
            await (0, globals_1.expect)(document_service_1.documentService.updateDocument('doc-123', {
                title: 'Updated Title'
            }, 'user-456')).rejects.toThrow('Update error');
            (0, globals_1.expect)(mockDb.transaction().begin).toHaveBeenCalled();
            (0, globals_1.expect)(mockDb.transaction().rollback).toHaveBeenCalled();
            (0, globals_1.expect)(mockDb.transaction().commit).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('searchDocuments', () => {
        (0, globals_1.test)('should call FTS search with correct parameters', async () => {
            const searchQuery = 'test query';
            const mockResults = [
                {
                    id: 'doc-123',
                    title: 'Test Document',
                    content: 'Test content',
                    keywords: '[]',
                    metadata: '{}',
                    title_snippet: 'Test <em>Document</em>',
                    content_snippet: 'Test <em>content</em>',
                    rank: 0.5
                }
            ];
            mockDb.query.mockReturnValueOnce([{ count: 1 }]);
            mockDb.query.mockReturnValueOnce(mockResults);
            const result = await document_service_1.documentService.searchDocuments(searchQuery);
            (0, globals_1.expect)(result.total).toBe(1);
            (0, globals_1.expect)(result.results.length).toBe(1);
            (0, globals_1.expect)(result.results[0].id).toBe('doc-123');
            (0, globals_1.expect)(result.results[0].snippet).toContain('<em>');
        });
    });
});
//# sourceMappingURL=document.service.test.js.map