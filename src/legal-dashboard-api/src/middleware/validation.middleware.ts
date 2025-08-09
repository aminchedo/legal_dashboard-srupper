import { NextFunction, Request, Response } from 'express';
import Joi, { Schema } from 'joi';
import { HttpError } from './error.middleware';

export function validateBody(schema: Schema) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new HttpError(400, 'Validation failed', error.details.map((d) => d.message));
        }
        req.body = value;
        next();
    };
}

export function validateQuery(schema: Schema) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new HttpError(400, 'Validation failed', error.details.map((d) => d.message));
        }
        req.query = value;
        next();
    };
}


