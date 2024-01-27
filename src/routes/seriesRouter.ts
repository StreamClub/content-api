import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { SearchContentSchema } from "@dtos";

export function SeriesRouter(dependencies: AppDependencies) {
    const router = Router();

    router.get(
        "/",
        loadUserContext,
        validateSchema(SearchContentSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => { return new Promise((_) => { }) },
            StatusCodes.OK
        )
    );

    return router;
}
