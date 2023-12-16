
import * as express from 'express';
import * as core from 'express-serve-static-core';

export type Request<
  T = any,
  U = core.ParamsDictionary,
  V = core.Query,
> = express.Request<U, any, T, V>;
