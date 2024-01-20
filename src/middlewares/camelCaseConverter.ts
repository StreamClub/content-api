import { objectToCamel } from 'ts-case-convert';
import { RequestHandler } from 'express';

export function toCamelCase(): RequestHandler {
    return (req, _, next) => {
        req.body = objectToCamel(req.body);
        next();
    };
}

export function parseToCamelCase<T>(object: object): any {
    return objectToCamel(object);
}
