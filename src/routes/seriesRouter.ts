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
import { SeriesController } from "@controllers";

export function SeriesRouter(dependencies: AppDependencies) {
    const router = Router();
    const seriesController = new SeriesController(dependencies);

    router.get(
        "/",
        loadUserContext,
        validateSchema(SearchContentSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => seriesController.searchSeries(req, res),
            StatusCodes.OK
        )
    );


    return router;
}
