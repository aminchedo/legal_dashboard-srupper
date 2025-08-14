import { NextFunction, Request, Response } from 'express';
export interface AuthPayload {
    id: string;
    sub: string;
    email: string;
    role: 'user' | 'admin';
    iat?: number;
    exp?: number;
}
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): void;
export declare function requireAdmin(req: Request, _res: Response, next: NextFunction): void;
