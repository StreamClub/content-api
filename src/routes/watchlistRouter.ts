import { FieldOptions, handleRequest, loadUserContext, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { AddContentSchema, GetContentListSchema, UpdatePrivacySchema } from '@dtos'
import { WatchlistController } from '@controllers'

export function WatchlistRouter(dependencies: AppDependencies) {
    const router = Router()
    const watchlistController = new WatchlistController(dependencies)

    router.post(
        '/',
        loadUserContext,
        handleRequest((req, res) => watchlistController.create(req, res), StatusCodes.CREATED)
    )


    router.get(
        "/privacy",
        loadUserContext,
        handleRequest((req, res) => watchlistController.getPrivacy(req, res), StatusCodes.OK)
    )

    router.patch(
        "/privacy",
        loadUserContext,
        validateSchema(UpdatePrivacySchema, [FieldOptions.body]),
        handleRequest((req, res) => watchlistController.updatePrivacy(req, res), StatusCodes.OK)
    )

    router.get(
        '/:userId',
        loadUserContext,
        validateSchema(GetContentListSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest((req) => watchlistController.get(req), StatusCodes.OK)
    )

    router.put(
        '/',
        loadUserContext,
        validateSchema(AddContentSchema, [FieldOptions.params, FieldOptions.body]),
        handleRequest((req, res) => watchlistController.addContent(req, res), StatusCodes.CREATED)
    )

    router.delete(
        '/',
        loadUserContext,
        validateSchema(AddContentSchema, [FieldOptions.params, FieldOptions.body]),
        handleRequest((req, res) => watchlistController.removeContent(req, res), StatusCodes.OK)
    )

    return router
}
