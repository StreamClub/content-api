import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { DiscoverContentSchema, GetContentResumeSchema, GetSeasonSchema, GetSeriesCreditsSchema, GetSeriesSchema, GetSimilarSeriesSchema, GetSubscribeRecommendationsSchema, SearchContentSchema } from "@dtos";
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
        "/discover",
        loadUserContext,
        validateSchema(DiscoverContentSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => seriesController.discoverSeries(req, res),
            StatusCodes.OK
        )
    );

    router.get(
        "/resume",
        loadUserContext,
        validateSchema(GetContentResumeSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => seriesController.getSeriesResume(req, res),
            StatusCodes.OK
        )
    );

    router.get(
        "/recommendations",
        loadUserContext,
        validateSchema(GetSubscribeRecommendationsSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => seriesController.getFriendsRecommendations(req, res),
            StatusCodes.OK
        )
    );

    router.get(
        "/similar",
        loadUserContext,
        validateSchema(GetSimilarSeriesSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => seriesController.getSimilarSeries(req, res),
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
