import {NextFunction, Request, Response} from 'express';
import {AppError} from "../utils/AppError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    const statusCode = err instanceof AppError ? err.statusCode : 500;

    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message, // Only show the stack trace if we are in development mode! It's a security risk in production.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });


}
