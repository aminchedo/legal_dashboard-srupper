import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { Server, Socket } from 'socket.io';
import { Request, Response } from 'express';
import * as websocketController from '@controllers/websocket.controller';

// Mock socket.io
jest.mock('socket.io');
jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn()
  }
}));

describe('WebSocket Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockServer: any;
  let mockSocket: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock request and response
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    
    // Mock Socket.IO server
    mockServer = {
      on: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };
    
    // Mock individual socket
    mockSocket = {
      id: 'socket-123',
      join: jest.fn(),
      leave: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      on: jest.fn()
    };
    
    // Reset the module to test attaching a new server
    jest.resetModules();
    jest.doMock('socket.io', () => {
      return {
        Server: jest.fn().mockImplementation(() => mockServer)
      };
    });
    
    // Import the module again after mocking
    jest.isolateModules(() => {
      Object.defineProperty(websocketController, 'getSocketIO', {
        value: jest.fn().mockReturnValue(mockServer)
      });
    });
  });
  
  describe('attachSocket', () => {
    test('should attach socket.io server', () => {
      // Arrange
      const httpServer = {};
      
      // Act
      websocketController.attachSocket(httpServer);
      
      // Assert
      expect(Server).toHaveBeenCalledWith(httpServer, expect.any(Object));
    });
  });
  
  describe('emitSystemEvent', () => {
    test('should emit event with timestamp', () => {
      // Arrange
      const event = 'test_event';
      const data = { test: 'data' };
      
      // Mock getSocketIO to return our mock server
      Object.defineProperty(websocketController, 'getSocketIO', {
        value: jest.fn().mockReturnValue(mockServer)
      });
      
      // Act
      websocketController.emitSystemEvent(event, data);
      
      // Assert
      expect(mockServer.emit).toHaveBeenCalledWith(event, {
        ...data,
        timestamp: expect.any(String)
      });
    });
    
    test('should not emit if socket is not initialized', () => {
      // Arrange
      const event = 'test_event';
      const data = { test: 'data' };
      
      // Mock getSocketIO to return null
      Object.defineProperty(websocketController, 'getSocketIO', {
        value: jest.fn().mockReturnValue(null)
      });
      
      // Act
      websocketController.emitSystemEvent(event, data);
      
      // Assert
      expect(mockServer.emit).not.toHaveBeenCalled();
    });
  });
  
  describe('emitDocumentEvent', () => {
    test('should emit event to document room', () => {
      // Arrange
      const documentId = 'doc-123';
      const event = 'document_updated';
      const data = { version: 2 };
      
      // Mock getSocketIO to return our mock server
      Object.defineProperty(websocketController, 'getSocketIO', {
        value: jest.fn().mockReturnValue(mockServer)
      });
      
      // Act
      websocketController.emitDocumentEvent(documentId, event, data);
      
      // Assert
      expect(mockServer.to).toHaveBeenCalledWith(`document:${documentId}`);
      expect(mockServer.to().emit).toHaveBeenCalledWith(event, {
        ...data,
        documentId,
        timestamp: expect.any(String)
      });
    });
  });
  
  describe('info endpoint', () => {
    test('should return available events', async () => {
      // Act
      await websocketController.info(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        events: expect.any(Array)
      }));
    });
  });
});
