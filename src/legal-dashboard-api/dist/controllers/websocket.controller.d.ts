import { Request, Response } from 'express';
import { Server } from 'socket.io';
interface SocketUser {
    id: string;
    username: string;
    rooms: string[];
}
export declare function attachSocket(server: unknown): void;
export declare function emitSystemEvent(event: string, data: Record<string, unknown>): void;
export declare function emitDocumentEvent(documentId: string, event: string, data: Record<string, unknown>): void;
export declare function getSocketIO(): Server | null;
export declare function getConnectedUsers(): Map<string, SocketUser>;
export declare function info(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
