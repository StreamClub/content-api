import {
    FieldOptions,
    handleRequest,
    validateSchema,
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { MovieController } from "@controllers";
import { GetMovieSchema } from "@dtos";

export function MovieRouter(dependencies: AppDependencies) {
    const router = Router();
    const movieController = new MovieController(dependencies);

    router.get(
        "/:movieId",
        validateSchema(GetMovieSchema, [FieldOptions.params]),
        handleRequest(
            (req) => movieController.getMovie(req),
            StatusCodes.OK
        )
    );

    return router;
}
