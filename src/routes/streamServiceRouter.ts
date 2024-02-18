import {
    FieldOptions,
    handleRequest,
    validateSchema,
    loadUserContext
} from "@middlewares";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import AppDependencies from "appDependencies";
import { GetStreamServiceSchema, SearchContentSchema } from "@dtos";
import { StreamServiceController } from "@controllers";

export function StreamServiceRouter(dependencies: AppDependencies) {
    const router = Router();
    const streamServiceController = new StreamServiceController(dependencies);

    router.get(
        "/",
        validateSchema(GetStreamServiceSchema, [FieldOptions.query]),
        handleRequest(
            (req, res) => streamServiceController.getStreamServices(req, res),
            StatusCodes.OK
        )
    );

    return router;
}
