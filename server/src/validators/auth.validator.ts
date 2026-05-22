import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// 1. Define the rules for registration (Zod v4 uses "message" instead of "required_error")
export const registerSchema = z.object({
    body: z.object({
        username: z.string({ message: 'Username is required' }).min(3, 'Username must be at least 3 characters'),
        email: z.string({ message: 'Email is required' }).email('Not a valid email'),
        password: z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ message: 'Email is required' }).email('Not a valid email'),
        password: z.string({ message: 'Password is required'})
    })
})


// 2. Create a generic validation middleware
// Zod v4 uses ZodSchema instead of AnyZodObject
export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next(); // Input is perfect, let them through!
        } catch (error: any) {
            // Input failed validation! Kick them out immediately
            res.status(400).json({
                message: 'Validation failed',
                errors: error.errors,
            });
        }
    };
};
