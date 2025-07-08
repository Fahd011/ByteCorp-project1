import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);

  const status = err.status || 500;

  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};
