import {
    FieldOptions,
    handleRequest,
    validateSchema,
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
        validateSchema(SearchMovieSchema, [FieldOptions.query]),
        handleRequest(
            (req) => movieController.searchMovie(req),
            StatusCodes.OK
        )
    );

    router.get(
        "/:movieId",
        validateSchema(GetMovieSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest(
            (req) => movieController.getMovie(req),
            StatusCodes.OK
        )
    );


    return router;
}
