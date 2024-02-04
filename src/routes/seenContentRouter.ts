import { handleRequest, loadUserContext } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { SeenContentController } from '@controllers'

export function SeenContentRouter(dependencies: AppDependencies) {
    const router = Router()
    const seenContentController = new SeenContentController(dependencies)

    router.post(
        '/',
        loadUserContext,
        handleRequest((req, res) => seenContentController.create(req, res), StatusCodes.CREATED)
    )

    router.put(
        '/movies/:movieId',
        loadUserContext,
        handleRequest((req, res) => seenContentController.addMovie(req, res), StatusCodes.CREATED)
    )

    router.delete(
        '/movies/:movieId',
        loadUserContext,
        handleRequest((req, res) => seenContentController.removeMovie(req, res), StatusCodes.NO_CONTENT)
    )

    return router
}
