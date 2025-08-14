import { Request, Response } from 'express';
export declare function processSingle(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function processAndSave(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function batchProcess(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function jobStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function qualityMetrics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function models(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function status(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
