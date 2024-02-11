import { logger } from '@utils';
import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const { path, params, query, method, body, headers } = req;

    logger.http(`New Request: ${method} ${path}
        Params: ${JSON.stringify(params)}
        Query: ${JSON.stringify(query)}
        Body: ${JSON.stringify(body)}
        Headers: ${JSON.stringify(headers)}`);
    next();
}
