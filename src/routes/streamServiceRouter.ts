import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { AddProviderSchema, GetSUserStreamServiceSchema, GetStreamServiceSchema } from "@dtos";
import { StreamProviderController } from "@controllers";

export function StreamProvider(dependencies: AppDependencies) {
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
        "/:userId",
        loadUserContext,
        validateSchema(GetSUserStreamServiceSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest(
            (req, res) => streamProviderController.getUserStreamProviders(req, res),
            StatusCodes.OK
        )
    )

    return router;
}
