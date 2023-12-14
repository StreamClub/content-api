import { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export enum FieldOptions {
  body = "body",
  params = "params",
  query = "query",
}

export const validateSchema = (
  joiSchema: ObjectSchema,
  properties: FieldOptions[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let fields = {};
    properties.forEach((property) => {
      fields = { ...fields, ...req[property] };
    });
    const { error } = joiSchema.validate(fields, { abortEarly: false });
    const valid = (error == null);
    if (valid) {
      next();
    } else {
      const { details } = error;
      const errors = details.map((detail) => {
        return {
          message: detail.message,
          field: detail.path[0],
        };
      });
      res.setHeader("Content-Type", "application/json");
      res.status(StatusCodes.BAD_REQUEST).send(JSON.stringify({
        code: StatusCodes.BAD_REQUEST,
        description: "Bad Request",
        error: errors
      }));
    }
  };
};
