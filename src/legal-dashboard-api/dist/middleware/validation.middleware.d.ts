import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
export declare function validateBody(schema: Schema): (req: Request, _res: Response, next: NextFunction) => void;
export declare function validateQuery(schema: Schema): (req: Request, _res: Response, next: NextFunction) => void;
