import { handleRequest, loadUserContext } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { TriviaController } from '@controllers'

export function TriviaRouter(dependencies: AppDependencies) {
    const router = Router()
    const triviaController = new TriviaController(dependencies)

    router.get(
        "/",
        loadUserContext,
        handleRequest((req, res) => triviaController.getTrivias(req, res), StatusCodes.OK)
    )

    return router
}
