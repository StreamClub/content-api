import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { AddProviderSchema, GetUserStreamServiceSchema, GetStreamServiceSchema, GetStreamServicesStatsSchema, GetSubscribeRecommendationsSchema } from "@dtos";
import { StreamProviderController } from "@controllers";

export function StreamProviderRouter(dependencies: AppDependencies) {
    const router = Router();
    const streamProviderController = new StreamProviderController(dependencies);

    router.get(
        "/",
        validateSchema(GetStreamServiceSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => streamProviderController.getStreamProviders(req, res),
            StatusCodes.OK
        )
    );

    router.post(
        "/",
        loadUserContext,
        handleRequest(
            (req, res) => streamProviderController.create(req, res),
            StatusCodes.CREATED
        )
    );

    router.put(
        '/',
        loadUserContext,
        validateSchema(AddProviderSchema, [FieldOptions.body]),
        handleRequest((req, res) => streamProviderController.addProvider(req, res), StatusCodes.CREATED)
    )

    router.delete(
        "/",
        loadUserContext,
        validateSchema(AddProviderSchema, [FieldOptions.body]),
        handleRequest(
            (req, res) => streamProviderController.deleteProvider(req, res),
            StatusCodes.OK
        )
    )

    router.get(
        "/stats",
        loadUserContext,
        validateSchema(GetStreamServicesStatsSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => streamProviderController.getStats(req, res),
            StatusCodes.OK
        )
    )

    router.get(
        "/subscribeRecommendations",
        loadUserContext,
        validateSchema(GetSubscribeRecommendationsSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => streamProviderController.getSubscribeRecommendations(req, res),
            StatusCodes.OK
        )
    )

    router.get(
        "/:userId",
        loadUserContext,
        validateSchema(GetUserStreamServiceSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest(
            (req, res) => streamProviderController.getUserStreamProviders(req, res),
            StatusCodes.OK
        )
    )


    return router;
}
