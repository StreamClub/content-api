import { Response as ExpressResponse } from 'express';

export type Response<T = any> = ExpressResponse<T>;
