import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { GetArtistSchema, SearchArtistSchema, SearchContentSchema } from "@dtos";
import { ArtistController } from "@controllers";

export function ArtistRouter(dependencies: AppDependencies) {
    const router = Router();
    const artistController = new ArtistController(dependencies);

    router.get(
        "/",
        loadUserContext,
        validateSchema(SearchArtistSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => artistController.searchArtist(req, res),
            StatusCodes.OK

        )
    );

    router.get(
        "/:artistId",
        loadUserContext,
        validateSchema(GetArtistSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest(
            (req, res) => artistController.getArtist(req),
            StatusCodes.OK
        )
    );

    return router;
}
