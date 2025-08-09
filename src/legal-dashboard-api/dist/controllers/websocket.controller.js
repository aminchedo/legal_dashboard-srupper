"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachSocket = attachSocket;
exports.emitSystemEvent = emitSystemEvent;
exports.emitDocumentEvent = emitDocumentEvent;
exports.getSocketIO = getSocketIO;
exports.getConnectedUsers = getConnectedUsers;
exports.info = info;
const socket_io_1 = require("socket.io");
const logger_1 = require("../utils/logger");
const config_1 = require("../utils/config");
let io = null;
const connectedUsers = new Map();
function attachSocket(server) {
    if (io)
        return;
    io = new socket_io_1.Server(server, {
        cors: {
            origin: config_1.config.CORS_ORIGIN,
            credentials: true
        }
    });
    setupSocketEvents(io);
    logger_1.logger.info('Socket.IO server initialized and ready');
}
function setupSocketEvents(socketIo) {
    socketIo.on('connection', (socket) => {
        logger_1.logger.info(`Socket connected: ${socket.id}`);
        socket.on('authenticate', (userData) => {
            if (!userData || !userData.id) {
                socket.emit('error', { message: 'Authentication failed' });
                return;
            }
            connectedUsers.set(socket.id, {
                id: userData.id,
                username: userData.username,
                rooms: []
            });
            socket.emit('authenticated', { success: true });
            emitSystemEvent('user_connected', { userId: userData.id });
            logger_1.logger.info(`User authenticated: ${userData.username} (${userData.id})`);
        });
        socket.on('join_document', (documentId) => {
            const user = connectedUsers.get(socket.id);
            if (!user) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }
            const roomId = `document:${documentId}`;
            socket.join(roomId);
            user.rooms.push(roomId);
            socket.to(roomId).emit('user_joined_document', {
                userId: user.id,
                username: user.username,
                documentId
            });
            logger_1.logger.info(`User ${user.username} joined document room: ${documentId}`);
        });
        socket.on('leave_document', (documentId) => {
            const user = connectedUsers.get(socket.id);
            if (!user)
                return;
            const roomId = `document:${documentId}`;
            socket.leave(roomId);
            user.rooms = user.rooms.filter(r => r !== roomId);
            socket.to(roomId).emit('user_left_document', {
                userId: user.id,
                username: user.username,
                documentId
            });
        });
        socket.on('document_update', (data) => {
            const user = connectedUsers.get(socket.id);
            if (!user) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }
            const roomId = `document:${data.documentId}`;
            socket.to(roomId).emit('document_updated', {
                changes: data.changes,
                version: data.version,
                userId: user.id,
                username: user.username,
                timestamp: new Date().toISOString()
            });
        });
        socket.on('scraping_progress', (data) => {
            emitSystemEvent('scraping_update', data);
        });
        socket.on('ocr_progress', (data) => {
            emitSystemEvent('ocr_update', data);
        });
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: Date.now() });
        });
        socket.on('disconnect', () => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                user.rooms.forEach(roomId => {
                    socket.to(roomId).emit('user_disconnected', {
                        userId: user.id,
                        username: user.username
                    });
                });
                emitSystemEvent('user_disconnected', { userId: user.id });
                connectedUsers.delete(socket.id);
            }
            logger_1.logger.info(`Socket disconnected: ${socket.id}`);
        });
    });
}
function emitSystemEvent(event, data) {
    if (!io)
        return;
    io.emit(event, {
        ...data,
        timestamp: new Date().toISOString()
    });
    logger_1.logger.debug(`System event emitted: ${event}`, data);
}
function emitDocumentEvent(documentId, event, data) {
    if (!io)
        return;
    const roomId = `document:${documentId}`;
    io.to(roomId).emit(event, {
        ...data,
        documentId,
        timestamp: new Date().toISOString()
    });
}
function getSocketIO() {
    return io;
}
function getConnectedUsers() {
    return connectedUsers;
}
async function info(_req, res) {
    return res.json({
        events: [
            'document_uploaded',
            'document_processed',
            'document_updated',
            'user_joined_document',
            'user_left_document',
            'scraping_update',
            'system_health',
            'analytics_update',
            'ocr_update',
            'notification',
            'user_activity',
            'user_connected',
            'user_disconnected',
            'heartbeat',
            'ping',
            'pong',
            'error'
        ],
        connections: {
            total: connectedUsers.size,
        }
    });
}
//# sourceMappingURL=websocket.controller.js.map