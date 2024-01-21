import { FieldOptions, handleRequest, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { AddContentSchema, GetWatchlistSchema } from '@dtos'
import { WatchlistController } from '@controllers'

export function WatchlistRouter(dependencies: AppDependencies) {
    const router = Router()
    const watchlistController = new WatchlistController(dependencies)

    router.post(
        '/',
        validateSchema(GetWatchlistSchema, [FieldOptions.body]),
        handleRequest((req) => watchlistController.create(req), StatusCodes.OK)
    )

    router.get(
        '/:userId',
        validateSchema(GetWatchlistSchema, [FieldOptions.params]),
        handleRequest((req) => watchlistController.get(req), StatusCodes.OK)
    )

    router.put(
        '/:userId',
        validateSchema(AddContentSchema, [FieldOptions.params, FieldOptions.body]),
        handleRequest((req) => watchlistController.addContent(req), StatusCodes.OK)
    )

    router.delete(
        '/:userId',
        validateSchema(AddContentSchema, [FieldOptions.params, FieldOptions.body]),
        handleRequest((req) => watchlistController.removeContent(req), StatusCodes.OK)
    )

    return router
}
