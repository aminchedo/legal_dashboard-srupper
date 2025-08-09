"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const documentsController = __importStar(require("../../controllers/documents.controller"));
const document_service_1 = require("../../services/document.service");
globals_1.jest.mock('@services/document.service');
globals_1.jest.mock('@utils/logger', () => ({
    logger: {
        info: globals_1.jest.fn(),
        error: globals_1.jest.fn(),
        debug: globals_1.jest.fn()
    }
}));
(0, globals_1.describe)('Documents Controller', () => {
    let mockRequest;
    let mockResponse;
    let mockDocumentService;
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        mockRequest = {
            params: {},
            query: {},
            body: {},
            user: {
                id: 'test-user-id',
                username: 'testuser'
            }
        };
        mockResponse = {
            json: globals_1.jest.fn().mockReturnThis(),
            status: globals_1.jest.fn().mockReturnThis(),
            send: globals_1.jest.fn().mockReturnThis()
        };
        mockDocumentService = document_service_1.documentService;
    });
    (0, globals_1.describe)('list', () => {
        (0, globals_1.test)('should return a list of documents', async () => {
            const mockResult = {
                items: [{ id: 'doc1', title: 'Document 1' }, { id: 'doc2', title: 'Document 2' }],
                total: 2,
                page: 1,
                pageCount: 1
            };
            mockDocumentService.listDocuments.mockResolvedValueOnce(mockResult);
            await documentsController.list(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
                items: mockResult.items,
                pagination: {
                    total: 2,
                    page: 1,
                    pageCount: 1
                }
            });
            (0, globals_1.expect)(mockDocumentService.listDocuments).toHaveBeenCalled();
        });
        (0, globals_1.test)('should handle errors', async () => {
            mockDocumentService.listDocuments.mockRejectedValueOnce(new Error('Database error'));
            await documentsController.list(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(500);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                error: 'Failed to list documents'
            }));
        });
    });
    (0, globals_1.describe)('getById', () => {
        (0, globals_1.test)('should return a document when found', async () => {
            const mockDocument = { id: 'doc123', title: 'Test Document' };
            mockRequest.params = { id: 'doc123' };
            mockDocumentService.getDocumentById.mockResolvedValueOnce(mockDocument);
            await documentsController.getById(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith(mockDocument);
            (0, globals_1.expect)(mockDocumentService.getDocumentById).toHaveBeenCalledWith('doc123');
        });
        (0, globals_1.test)('should return 404 when document not found', async () => {
            mockRequest.params = { id: 'nonexistent' };
            mockDocumentService.getDocumentById.mockResolvedValueOnce(null);
            await documentsController.getById(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(404);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({ error: 'Document not found' });
        });
    });
    (0, globals_1.describe)('create', () => {
        (0, globals_1.test)('should create a document and return it', async () => {
            const newDocument = { title: 'New Document', content: 'Content' };
            const createdDocument = { id: 'new-id', ...newDocument };
            mockRequest.body = newDocument;
            mockDocumentService.createDocument.mockResolvedValueOnce(createdDocument);
            await documentsController.create(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(201);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith(createdDocument);
            (0, globals_1.expect)(mockDocumentService.createDocument).toHaveBeenCalledWith(newDocument, 'test-user-id');
        });
    });
    (0, globals_1.describe)('update', () => {
        (0, globals_1.test)('should update a document and return it', async () => {
            const documentUpdate = { title: 'Updated Title' };
            const updatedDocument = { id: 'doc123', ...documentUpdate };
            mockRequest.params = { id: 'doc123' };
            mockRequest.body = documentUpdate;
            mockDocumentService.updateDocument.mockResolvedValueOnce(updatedDocument);
            await documentsController.update(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith(updatedDocument);
            (0, globals_1.expect)(mockDocumentService.updateDocument).toHaveBeenCalledWith('doc123', documentUpdate, 'test-user-id');
        });
        (0, globals_1.test)('should return 404 when document to update not found', async () => {
            mockRequest.params = { id: 'nonexistent' };
            mockRequest.body = { title: 'Updated Title' };
            mockDocumentService.updateDocument.mockResolvedValueOnce(null);
            await documentsController.update(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(404);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({ error: 'Document not found' });
        });
    });
    (0, globals_1.describe)('search', () => {
        (0, globals_1.test)('should return search results', async () => {
            const searchResults = {
                results: [{ id: 'doc1', title: 'Test', snippet: 'Test content' }],
                total: 1,
                page: 1,
                pageCount: 1
            };
            mockRequest.query = { q: 'test' };
            mockDocumentService.searchDocuments.mockResolvedValueOnce(searchResults);
            await documentsController.search(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
                query: 'test',
                results: searchResults.results,
                pagination: {
                    total: 1,
                    page: 1,
                    pageCount: 1
                }
            });
        });
        (0, globals_1.test)('should return 400 when query is missing', async () => {
            mockRequest.query = {};
            await documentsController.search(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({ error: 'Search query is required' });
        });
    });
});
//# sourceMappingURL=documents.controller.test.js.map