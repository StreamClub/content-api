import { FieldOptions, handleRequest, loadUserContext, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { TriviaController } from '@controllers'
import { GetTriviaSchema } from '@dtos'

export function TriviaRouter(dependencies: AppDependencies) {
    const router = Router()
    const triviaController = new TriviaController(dependencies)

    router.get(
        "/",
        loadUserContext,
        handleRequest((req, res) => triviaController.getTrivias(req, res), StatusCodes.OK)
    );

    router.get(
        "/:contentType/:contentId",
        validateSchema(GetTriviaSchema, [FieldOptions.params]),
        loadUserContext,
        handleRequest((req, res) => triviaController.getTrivia(req, res), StatusCodes.OK)
    );

    return router
}
