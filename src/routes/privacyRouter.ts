import { FieldOptions, handleRequest, loadUserContext, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { UpdateWatchlistPrivacySchema } from '@dtos'
import { PrivacyController } from '@controllers'

export function PrivacyRouter(dependencies: AppDependencies) {
    const router = Router()
    const privacyController = new PrivacyController(dependencies)

    router.get(
        "/",
        loadUserContext,
        handleRequest((req, res) => privacyController.getPrivacy(req, res), StatusCodes.OK)
    )

    // router.patch(
    //     "/",
    //     loadUserContext,
    //     validateSchema(UpdateWatchlistPrivacySchema, [FieldOptions.body]),
    //     handleRequest((req, res) => privacyController.updatePrivacy(req, res), StatusCodes.OK)
    // )

    return router
}
