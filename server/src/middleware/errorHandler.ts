import { Request, Response, NextFunction } from 'express';

/**
 * Express error handling middleware.
 *
 * This function has FOUR parameters - that's how Express knows it's
 * an error handler, not a regular middleware. When any route calls
 * next(error), Express skips all regular middleware and jumps here.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err.message);

  res.status(500).json({
    error: 'Internal server error',
  });
}
