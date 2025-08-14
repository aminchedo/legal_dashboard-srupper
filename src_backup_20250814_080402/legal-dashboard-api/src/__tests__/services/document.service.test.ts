import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import { documentService } from '@services/document.service';

// Mock dependencies
jest.mock('@services/database.service', () => {
  const mockTransaction = {
    begin: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn()
  };
  
  const mockClient = {
    query: jest.fn(),
    run: jest.fn(),
    transaction: jest.fn().mockReturnValue(mockTransaction)
  };
  
  return {
    databaseService: {
      getClient: () => mockClient
    }
  };
});

jest.mock('@controllers/websocket.controller', () => ({
  emitDocumentEvent: jest.fn()
}));

// Get access to the mocked database client - properly typed
let mockDb: any;

describe('Document Service', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
    
    // Get the mocked database client
    mockDb = (jest.requireMock('@services/database.service') as any).databaseService.getClient();
    
    // Reset transaction mocks
    const mockTransaction = {
      begin: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn()
    };
    mockDb.transaction.mockReturnValue(mockTransaction);
  });
  
  afterEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
  });
  
  describe('createDocument', () => {
    test('should create a new document with default values', async () => {
      // Arrange
      const documentData = {
        title: 'Test Document',
        content: 'Test content'
      };
      const userId = 'user-123';
      
      // Act
      await documentService.createDocument(documentData, userId);
      
      // Assert
      expect(mockDb.run).toHaveBeenCalledTimes(2); // One for document, one for version
      expect(mockDb.transaction().begin).toHaveBeenCalled();
      expect(mockDb.transaction().commit).toHaveBeenCalled();
      
      // Check that it called run with the right number of params
      const runCall = mockDb.run.mock.calls[0];
      expect(runCall[1].length).toBe(18); // Number of parameters in the insert
    });
    
    test('should handle errors and rollback transaction', async () => {
      // Arrange
      const documentData = {
        title: 'Test Document',
        content: 'Test content'
      };
      const userId = 'user-123';
      
      // Setup mock to throw an error
      mockDb.run.mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      
      // Act & Assert
      await expect(
        documentService.createDocument(documentData, userId)
      ).rejects.toThrow('Database error');
      
      // Verify transaction was rolled back
      expect(mockDb.transaction().begin).toHaveBeenCalled();
      expect(mockDb.transaction().rollback).toHaveBeenCalled();
      expect(mockDb.transaction().commit).not.toHaveBeenCalled();
    });
  });
  
  describe('getDocumentById', () => {
    test('should return document if found', async () => {
      // Arrange
      const mockDocument = {
        id: 'doc-123',
        title: 'Test Document',
        content: 'Test content',
        keywords: '[]',
        metadata: '{}'
      };
      
      mockDb.query.mockReturnValueOnce([mockDocument]);
      
      // Act
      const result = await documentService.getDocumentById('doc-123');
      
      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('doc-123');
      expect(mockDb.query).toHaveBeenCalled();
      expect(mockDb.query.mock.calls[0][1]).toEqual(['doc-123']);
    });
    
    test('should return null if document not found', async () => {
      // Arrange
      mockDb.query.mockReturnValueOnce([]);
      
      // Act
      const result = await documentService.getDocumentById('non-existent');
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('updateDocument', () => {
    test('should update document and create new version if content changed', async () => {
      // Arrange
      const originalDocument = {
        id: 'doc-123',
        title: 'Original Title',
        content: 'Original content',
        category: null,
        source: null,
        score: null,
        status: 'draft' as const,
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
      
      // Mock getDocumentById to return the original document
      jest.spyOn(documentService, 'getDocumentById').mockResolvedValueOnce(originalDocument);
      
      // Act
      await documentService.updateDocument('doc-123', {
        title: 'Updated Title',
        content: 'Updated content'
      }, 'user-456');
      
      // Assert
      expect(mockDb.run).toHaveBeenCalledTimes(2); // Update document and create version
      expect(mockDb.transaction().begin).toHaveBeenCalled();
      expect(mockDb.transaction().commit).toHaveBeenCalled();
    });
    
    test('should handle errors during update', async () => {
      // Arrange
      const originalDocument = {
        id: 'doc-123',
        title: 'Original Title',
        content: 'Original content',
        category: null,
        source: null,
        score: null,
        status: 'draft' as const,
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
      
      // Mock getDocumentById to return the original document
      jest.spyOn(documentService, 'getDocumentById').mockResolvedValueOnce(originalDocument);
      
      // Setup mock to throw an error
      mockDb.run.mockImplementationOnce(() => {
        throw new Error('Update error');
      });
      
      // Act & Assert
      await expect(
        documentService.updateDocument('doc-123', {
          title: 'Updated Title'
        }, 'user-456')
      ).rejects.toThrow('Update error');
      
      // Verify transaction was rolled back
      expect(mockDb.transaction().begin).toHaveBeenCalled();
      expect(mockDb.transaction().rollback).toHaveBeenCalled();
      expect(mockDb.transaction().commit).not.toHaveBeenCalled();
    });
  });
  
  describe('searchDocuments', () => {
    test('should call FTS search with correct parameters', async () => {
      // Arrange
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
      
      // First query for count
      mockDb.query.mockReturnValueOnce([{ count: 1 }]);
      // Second query for results
      mockDb.query.mockReturnValueOnce(mockResults);
      
      // Act
      const result = await documentService.searchDocuments(searchQuery);
      
      // Assert
      expect(result.total).toBe(1);
      expect(result.results.length).toBe(1);
      expect(result.results[0].id).toBe('doc-123');
      expect(result.results[0].snippet).toContain('<em>');
    });
  });
});
