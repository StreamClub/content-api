import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { MovieController } from "@controllers";
import { GetMovieCreditsSchema, GetMovieSchema, SearchContentSchema, GetContentResumeSchema, DiscoverContentSchema } from "@dtos";

export function MovieRouter(dependencies: AppDependencies) {
    const router = Router();
    const movieController = new MovieController(dependencies);

    router.get(
        "/",
        loadUserContext,
        validateSchema(SearchContentSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => movieController.searchMovie(req, res),
            StatusCodes.OK
        )
    );

    router.get(
        "/discover",
        loadUserContext,
        validateSchema(DiscoverContentSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => movieController.discoverMovies(req, res),
            StatusCodes.OK
        )
    )

    router.get(
        "/resume",
        validateSchema(GetContentResumeSchema, [FieldOptions.query]),
        handleRequest(
            (req) => movieController.getMoviesResume(req),
            StatusCodes.OK
        )
    )

    router.get(
        "/:movieId",
        loadUserContext,
        validateSchema(GetMovieSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest(
            (req, res) => movieController.getMovie(req, res),
            StatusCodes.OK
        )
    );

    router.get(
        "/:movieId/credits",
        loadUserContext,
        validateSchema(GetMovieCreditsSchema, [FieldOptions.params]),
        handleRequest(
            (req, res) => movieController.getMovieCredits(req, res),
            StatusCodes.OK
        )
    );

    return router;
}
