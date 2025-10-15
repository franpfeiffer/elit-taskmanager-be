import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation error',
            details: error.errors
        });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Resource not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Resource already exists' });
        }
    }

    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
};
