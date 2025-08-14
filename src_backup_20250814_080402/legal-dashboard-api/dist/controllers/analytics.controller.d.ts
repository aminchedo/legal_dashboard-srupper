import { Request, Response } from 'express';
export declare function overview(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function analyzeDocument(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function sentiment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function similarity(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function entities(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function predictCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function generateTopics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
