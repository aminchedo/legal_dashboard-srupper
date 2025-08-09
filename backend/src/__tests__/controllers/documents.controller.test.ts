import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as documentsController from '@controllers/documents.controller';
import { documentService } from '@services/document.service';

// Mock the document service
jest.mock('@services/document.service');
jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

describe('Documents Controller', () => {
  // Create request and response objects for testing
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockDocumentService: jest.Mocked<typeof documentService>;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response
    mockRequest = {
      params: {},
      query: {},
      body: {},
      // Add mock user for auth
      user: {
        id: 'test-user-id',
        username: 'testuser'
      }
    };
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    
    // Get the mocked document service
    mockDocumentService = documentService as jest.Mocked<typeof documentService>;
  });
  
  describe('list', () => {
    test('should return a list of documents', async () => {
      // Arrange
      const mockResult = {
        items: [{ id: 'doc1', title: 'Document 1' }, { id: 'doc2', title: 'Document 2' }],
        total: 2,
        page: 1,
        pageCount: 1
      };
      mockDocumentService.listDocuments.mockResolvedValueOnce(mockResult);
      
      // Act
      await documentsController.list(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        items: mockResult.items,
        pagination: {
          total: 2,
          page: 1,
          pageCount: 1
        }
      });
      expect(mockDocumentService.listDocuments).toHaveBeenCalled();
    });
    
    test('should handle errors', async () => {
      // Arrange
      mockDocumentService.listDocuments.mockRejectedValueOnce(new Error('Database error'));
      
      // Act
      await documentsController.list(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Failed to list documents'
        })
      );
    });
  });
  
  describe('getById', () => {
    test('should return a document when found', async () => {
      // Arrange
      const mockDocument = { id: 'doc123', title: 'Test Document' };
      mockRequest.params = { id: 'doc123' };
      mockDocumentService.getDocumentById.mockResolvedValueOnce(mockDocument);
      
      // Act
      await documentsController.getById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(mockDocument);
      expect(mockDocumentService.getDocumentById).toHaveBeenCalledWith('doc123');
    });
    
    test('should return 404 when document not found', async () => {
      // Arrange
      mockRequest.params = { id: 'nonexistent' };
      mockDocumentService.getDocumentById.mockResolvedValueOnce(null);
      
      // Act
      await documentsController.getById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Document not found' });
    });
  });
  
  describe('create', () => {
    test('should create a document and return it', async () => {
      // Arrange
      const newDocument = { title: 'New Document', content: 'Content' };
      const createdDocument = { id: 'new-id', ...newDocument };
      mockRequest.body = newDocument;
      mockDocumentService.createDocument.mockResolvedValueOnce(createdDocument);
      
      // Act
      await documentsController.create(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdDocument);
      expect(mockDocumentService.createDocument).toHaveBeenCalledWith(
        newDocument,
        'test-user-id'
      );
    });
  });
  
  describe('update', () => {
    test('should update a document and return it', async () => {
      // Arrange
      const documentUpdate = { title: 'Updated Title' };
      const updatedDocument = { id: 'doc123', ...documentUpdate };
      mockRequest.params = { id: 'doc123' };
      mockRequest.body = documentUpdate;
      mockDocumentService.updateDocument.mockResolvedValueOnce(updatedDocument);
      
      // Act
      await documentsController.update(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(updatedDocument);
      expect(mockDocumentService.updateDocument).toHaveBeenCalledWith(
        'doc123',
        documentUpdate,
        'test-user-id'
      );
    });
    
    test('should return 404 when document to update not found', async () => {
      // Arrange
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.body = { title: 'Updated Title' };
      mockDocumentService.updateDocument.mockResolvedValueOnce(null);
      
      // Act
      await documentsController.update(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Document not found' });
    });
  });
  
  describe('search', () => {
    test('should return search results', async () => {
      // Arrange
      const searchResults = {
        results: [{ id: 'doc1', title: 'Test', snippet: 'Test content' }],
        total: 1,
        page: 1,
        pageCount: 1
      };
      mockRequest.query = { q: 'test' };
      mockDocumentService.searchDocuments.mockResolvedValueOnce(searchResults);
      
      // Act
      await documentsController.search(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        query: 'test',
        results: searchResults.results,
        pagination: {
          total: 1,
          page: 1,
          pageCount: 1
        }
      });
    });
    
    test('should return 400 when query is missing', async () => {
      // Arrange
      mockRequest.query = {};
      
      // Act
      await documentsController.search(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Search query is required' });
    });
  });
});
