import { Request, Response } from 'express';
export declare function register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function me(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listUsers(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function health(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
