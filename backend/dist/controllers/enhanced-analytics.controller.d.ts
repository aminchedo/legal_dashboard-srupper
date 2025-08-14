import { Request, Response } from 'express';
export declare function predictiveInsights(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function realTimeMetrics(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function systemHealth(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
