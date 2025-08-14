import { NextFunction, Request, Response } from 'express';
export declare class HttpError extends Error {
    status: number;
    details?: unknown;
    constructor(status: number, message: string, details?: unknown);
}
export declare function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>>;
