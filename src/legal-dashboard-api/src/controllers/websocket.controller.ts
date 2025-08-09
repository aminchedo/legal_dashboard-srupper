import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';
import { config } from '../utils/config';
import { DocumentUpdateData, ScrapingProgressData } from '../types/websocket.types';

let io: Server | null = null;

interface SocketUser {
    id: string;
    username: string;
    rooms: string[];
}

// Store connected users
const connectedUsers = new Map<string, SocketUser>();

export function attachSocket(server: unknown): void {
    if (io) return;
    io = new Server(server as HttpServer, {
        cors: {
            origin: config.CORS_ORIGIN,
            credentials: true
        }
    });

    setupSocketEvents(io);
    logger.info('Socket.IO server initialized and ready');
}

function setupSocketEvents(socketIo: Server): void {
    socketIo.on('connection', (socket: Socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        // Handle authentication
        socket.on('authenticate', (userData: { id: string; username: string }) => {
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
            logger.info(`User authenticated: ${userData.username} (${userData.id})`);
        });

        // Join document room for collaborative viewing/editing
        socket.on('join_document', (documentId: string) => {
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

            logger.info(`User ${user.username} joined document room: ${documentId}`);
        });

        // Leave document room
        socket.on('leave_document', (documentId: string) => {
            const user = connectedUsers.get(socket.id);
            if (!user) return;

            const roomId = `document:${documentId}`;
            socket.leave(roomId);
            user.rooms = user.rooms.filter(r => r !== roomId);

            socket.to(roomId).emit('user_left_document', {
                userId: user.id,
                username: user.username,
                documentId
            });
        });

        // Document updates (for collaborative editing)
        socket.on('document_update', (data: DocumentUpdateData) => {
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

        // Handle scraping status updates
        socket.on('scraping_progress', (data: ScrapingProgressData) => {
            emitSystemEvent('scraping_update', data);
        });

        // Handle OCR progress
        socket.on('ocr_progress', (data: {
            documentId: string;
            progress: number;
            status: string;
        }) => {
            emitSystemEvent('ocr_update', data);
        });

        // Heartbeat to keep connections alive
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: Date.now() });
        });

        // Disconnect handling
        socket.on('disconnect', () => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                // Notify rooms that user left
                user.rooms.forEach(roomId => {
                    socket.to(roomId).emit('user_disconnected', {
                        userId: user.id,
                        username: user.username
                    });
                });

                emitSystemEvent('user_disconnected', { userId: user.id });
                connectedUsers.delete(socket.id);
            }

            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });
}

// Helper function to emit system events
export function emitSystemEvent(event: string, data: Record<string, unknown>): void {
    if (!io) return;
    io.emit(event, {
        ...data,
        timestamp: new Date().toISOString()
    });
    logger.debug(`System event emitted: ${event}`, data);
}

// Function to emit document events to specific document room
export function emitDocumentEvent(documentId: string, event: string, data: Record<string, unknown>): void {
    if (!io) return;
    const roomId = `document:${documentId}`;
    io.to(roomId).emit(event, {
        ...data,
        documentId,
        timestamp: new Date().toISOString()
    });
}

// Get Socket.IO instance (for use in other controllers/services)
export function getSocketIO(): Server | null {
    return io;
}

// Get currently connected users
export function getConnectedUsers(): Map<string, SocketUser> {
    return connectedUsers;
}

// REST API endpoint to get websocket info
export async function info(_req: Request, res: Response) {
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


