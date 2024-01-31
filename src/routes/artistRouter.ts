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
import { ArtistController } from "@controllers";

export function ArtistRouter(dependencies: AppDependencies) {
    const router = Router();
    const artistController = new ArtistController(dependencies);

    router.get(
        "/",
        loadUserContext,
        validateSchema(SearchContentSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => artistController.searchArtist(req, res),
            StatusCodes.OK

        )
    );

    return router;
}
