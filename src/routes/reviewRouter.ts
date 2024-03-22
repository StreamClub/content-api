import { FieldOptions, handleRequest, loadUserContext, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { AddReviewSchema, UserReviewSchema } from '@dtos'
import { ReviewController } from '@controllers'

export function ReviewRouter(dependencies: AppDependencies) {
    const router = Router()
    const reviewController = new ReviewController(dependencies)

    router.put(
        '/',
        loadUserContext,
        validateSchema(AddReviewSchema, [FieldOptions.body]),
        handleRequest((req, res) => reviewController.addReview(req, res), StatusCodes.CREATED)
    )

    router.get(
        "/users/:userId",
        loadUserContext,
        validateSchema(UserReviewSchema, [FieldOptions.params]),
        handleRequest((req, res) => reviewController.getReviewsByUserId(req, res), StatusCodes.OK)
    )

    return router
}
