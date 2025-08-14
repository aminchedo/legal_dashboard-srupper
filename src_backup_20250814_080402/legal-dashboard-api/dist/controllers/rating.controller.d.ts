import { Request, Response } from 'express';
export declare function rateDocument(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUserRating(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getDocumentRatings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteRating(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getRatingStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
