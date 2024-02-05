import { FieldOptions, handleRequest, loadUserContext, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { SeenContentController } from '@controllers'
import { GetContentListSchema } from '@dtos'

export function SeenContentRouter(dependencies: AppDependencies) {
    const router = Router()
    const seenContentController = new SeenContentController(dependencies)

    router.post(
        '/',
        loadUserContext,
        handleRequest((req, res) => seenContentController.create(req, res), StatusCodes.CREATED)
    )

    router.get(
        '/movies/:userId',
        loadUserContext,
        validateSchema(GetContentListSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest((req, res) => seenContentController.getMovies(req, res), StatusCodes.OK)
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
