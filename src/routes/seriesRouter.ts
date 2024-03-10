import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { GetSeasonSchema, GetSeriesCreditsSchema, GetSeriesSchema, SearchContentSchema } from "@dtos";
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

    router.get(
        "/:seriesId",
        loadUserContext,
        validateSchema(GetSeriesSchema, [FieldOptions.query, FieldOptions.params]),
        handleRequest(
            (req, res) => seriesController.getSeries(req, res),
            StatusCodes.OK
        )
    );

    router.get(
        "/:seriesId/credits",
        loadUserContext,
        validateSchema(GetSeriesCreditsSchema, [FieldOptions.params]),
        handleRequest(
            (req, res) => seriesController.getSeriesCredits(req, res),
            StatusCodes.OK
        )
    );



    router.get(
        "/:seriesId/seasons/:seasonId",
        loadUserContext,
        validateSchema(GetSeasonSchema, [FieldOptions.query, FieldOptions.params]),
        handleRequest(
            (req, res) => seriesController.getSeason(req, res),
            StatusCodes.OK
        )
    );

    return router;
}
