import { ApiException } from '@exceptions/apiException';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Don't remove the next parameter, otherwise the middleware is ignored by Express

export function exceptionToHttpError(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  let code: number;
  let description: string;
  const e = error as ApiException;
  if (e.isScException) {
    code = e.code;
    description = e.description;
  } else {
    code = StatusCodes.INTERNAL_SERVER_ERROR;
    description = 'Internal server error';
  }
  res.status(code).json({
    error: error.message,
    statusCode: code,
    description,
  });
}
