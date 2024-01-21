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
import { GetMovieSchema, SearchMovieSchema } from "@dtos";

export function MovieRouter(dependencies: AppDependencies) {
    const router = Router();
    const movieController = new MovieController(dependencies);

    router.get(
        "/",
        loadUserContext,
        validateSchema(SearchMovieSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => movieController.searchMovie(req, res),
            StatusCodes.OK
        )
    );

    router.get(
        "/:movieId",
        loadUserContext,
        validateSchema(GetMovieSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest(
            (req, res) => movieController.getMovie(req),
            StatusCodes.OK
        )
    );


    return router;
}
