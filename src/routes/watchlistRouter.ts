import { FieldOptions, handleRequest, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { GetWatchlistSchema } from '@dtos'
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

    return router
}
