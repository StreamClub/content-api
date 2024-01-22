import { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '@models';
import { parseToCamelCase } from './camelCaseConverter';

export function handleRequest<T, U>(
  handler: (req: Request<T>, res: Response<U>) => Promise<U>,
  statusCode = StatusCodes.OK,
): (req: Request<T>, res: Response<U>, next: NextFunction) => Promise<void> {
  return async (
    req: Request<T>,
    res: Response<U>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const resObject = (await handler(req, res)) as object;
      resObject ? res.status(statusCode).json(parseToCamelCase(resObject)) : res.status(statusCode).send();
    } catch (error) {
      next(error);
    }
  };
}
