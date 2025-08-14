import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';

export class HttpError extends Error {
    status: number;
    details?: unknown;
    constructor(status: number, message: string, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof HttpError) {
        logger.warn(`HTTP ${err.status}: ${err.message}`);
        return res.status(err.status).json({ error: err.message, details: err.details ?? null });
    }
    logger.error('Unhandled error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
}


