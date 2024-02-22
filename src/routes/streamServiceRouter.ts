import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { AddProviderSchema, GetContentListSchema, GetSUserStreamServiceSchema, GetStreamServiceSchema } from "@dtos";
import { StreamProvidersController } from "@controllers";

export function StreamServiceRouter(dependencies: AppDependencies) {
    const router = Router();
    const streamServiceController = new StreamProvidersController(dependencies);

    router.get(
        "/",
        validateSchema(GetStreamServiceSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => streamServiceController.getStreamProviders(req, res),
            StatusCodes.OK
        )
    );

    router.post(
        "/",
        loadUserContext,
        handleRequest(
            (req, res) => streamServiceController.create(req, res),
            StatusCodes.CREATED
        )
    );

    router.put(
        '/',
        loadUserContext,
        validateSchema(AddProviderSchema, [FieldOptions.params, FieldOptions.body]),
        handleRequest((req, res) => streamServiceController.addProvider(req, res), StatusCodes.CREATED)
    )

    router.get(
        "/:userId",
        loadUserContext,
        validateSchema(GetSUserStreamServiceSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest(
            (req, res) => streamServiceController.getUserStreamProviders(req, res),
            StatusCodes.OK
        )
    )

    return router;
}
