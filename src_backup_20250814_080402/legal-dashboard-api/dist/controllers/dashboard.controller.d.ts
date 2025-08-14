import { Request, Response } from 'express';
export declare function summary(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function chartsData(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function aiSuggestions(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function aiTrainingStats(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function aiFeedback(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function performanceMetrics(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function trends(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
