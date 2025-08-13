import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';
import { HttpError } from './error.middleware';

export interface AuthPayload {
    id: string;
    sub: string;
    email: string;
    role: 'user' | 'admin';
    iat?: number;
    exp?: number;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) throw new HttpError(401, 'Unauthorized');
    try {
        const payload = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
        (req as any).user = payload;
        next();
    } catch {
        throw new HttpError(401, 'Invalid token');
    }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
    const user = (req as any).user;
    if (!user) throw new HttpError(401, 'Unauthorized');
    if (user.role !== 'admin') throw new HttpError(403, 'Forbidden');
    next();
}


