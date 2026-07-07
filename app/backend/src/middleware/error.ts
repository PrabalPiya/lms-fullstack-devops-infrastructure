import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.flatten().fieldErrors
    });
  }

  if (error instanceof Error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Something went wrong' });
}
