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
const socket_io_1 = require("socket.io");
const websocketController = __importStar(require("../../controllers/websocket.controller"));
globals_1.jest.mock('socket.io');
globals_1.jest.mock('@utils/logger', () => ({
    logger: {
        info: globals_1.jest.fn(),
        error: globals_1.jest.fn(),
        debug: globals_1.jest.fn(),
        warn: globals_1.jest.fn()
    }
}));
(0, globals_1.describe)('WebSocket Controller', () => {
    let mockRequest;
    let mockResponse;
    let mockServer;
    let mockSocket;
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        mockRequest = {};
        mockResponse = {
            json: globals_1.jest.fn().mockReturnThis(),
            status: globals_1.jest.fn().mockReturnThis()
        };
        mockServer = {
            on: globals_1.jest.fn(),
            emit: globals_1.jest.fn(),
            to: globals_1.jest.fn().mockReturnThis(),
        };
        mockSocket = {
            id: 'socket-123',
            join: globals_1.jest.fn(),
            leave: globals_1.jest.fn(),
            to: globals_1.jest.fn().mockReturnThis(),
            emit: globals_1.jest.fn(),
            on: globals_1.jest.fn()
        };
        globals_1.jest.resetModules();
        globals_1.jest.doMock('socket.io', () => {
            return {
                Server: globals_1.jest.fn().mockImplementation(() => mockServer)
            };
        });
        globals_1.jest.isolateModules(() => {
            Object.defineProperty(websocketController, 'getSocketIO', {
                value: globals_1.jest.fn().mockReturnValue(mockServer)
            });
        });
    });
    (0, globals_1.describe)('attachSocket', () => {
        (0, globals_1.test)('should attach socket.io server', () => {
            const httpServer = {};
            websocketController.attachSocket(httpServer);
            (0, globals_1.expect)(socket_io_1.Server).toHaveBeenCalledWith(httpServer, globals_1.expect.any(Object));
        });
    });
    (0, globals_1.describe)('emitSystemEvent', () => {
        (0, globals_1.test)('should emit event with timestamp', () => {
            const event = 'test_event';
            const data = { test: 'data' };
            Object.defineProperty(websocketController, 'getSocketIO', {
                value: globals_1.jest.fn().mockReturnValue(mockServer)
            });
            websocketController.emitSystemEvent(event, data);
            (0, globals_1.expect)(mockServer.emit).toHaveBeenCalledWith(event, {
                ...data,
                timestamp: globals_1.expect.any(String)
            });
        });
        (0, globals_1.test)('should not emit if socket is not initialized', () => {
            const event = 'test_event';
            const data = { test: 'data' };
            Object.defineProperty(websocketController, 'getSocketIO', {
                value: globals_1.jest.fn().mockReturnValue(null)
            });
            websocketController.emitSystemEvent(event, data);
            (0, globals_1.expect)(mockServer.emit).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('emitDocumentEvent', () => {
        (0, globals_1.test)('should emit event to document room', () => {
            const documentId = 'doc-123';
            const event = 'document_updated';
            const data = { version: 2 };
            Object.defineProperty(websocketController, 'getSocketIO', {
                value: globals_1.jest.fn().mockReturnValue(mockServer)
            });
            websocketController.emitDocumentEvent(documentId, event, data);
            (0, globals_1.expect)(mockServer.to).toHaveBeenCalledWith(`document:${documentId}`);
            (0, globals_1.expect)(mockServer.to().emit).toHaveBeenCalledWith(event, {
                ...data,
                documentId,
                timestamp: globals_1.expect.any(String)
            });
        });
    });
    (0, globals_1.describe)('info endpoint', () => {
        (0, globals_1.test)('should return available events', async () => {
            await websocketController.info(mockRequest, mockResponse);
            (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                events: globals_1.expect.any(Array)
            }));
        });
    });
});
//# sourceMappingURL=websocket.controller.test.js.map