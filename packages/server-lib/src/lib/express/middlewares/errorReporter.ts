import { ErrorReporting } from '@google-cloud/error-reporting';
import { NextFunction, Request, Response } from 'express';

export const getErrorReporterHandler = (): ((
  req: Request,
  res: Response,
  next: NextFunction
) => void) => {
  const errors = new ErrorReporting();
  return errors.express as unknown as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
};
