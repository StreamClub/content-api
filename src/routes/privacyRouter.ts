import { FieldOptions, handleRequest, loadUserContext, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { UpdateSeenContentPrivacySchema, UpdateWatchlistPrivacySchema } from '@dtos'
import { PrivacyController } from '@controllers'

export function PrivacyRouter(dependencies: AppDependencies) {
    const router = Router()
    const privacyController = new PrivacyController(dependencies)

    router.get(
        "/",
        loadUserContext,
        handleRequest((req, res) => privacyController.getPrivacy(req, res), StatusCodes.OK)
    )

    router.patch(
        "/watchlist",
        loadUserContext,
        validateSchema(UpdateWatchlistPrivacySchema, [FieldOptions.body]),
        handleRequest((req, res) => privacyController.updateWatchlistPrivacy(req, res), StatusCodes.OK)
    )

    router.patch(
        "/seenContent",
        loadUserContext,
        validateSchema(UpdateSeenContentPrivacySchema, [FieldOptions.body]),
        handleRequest((req, res) => privacyController.updateSeenContentPrivacy(req, res), StatusCodes.OK)
    )

    return router
}
