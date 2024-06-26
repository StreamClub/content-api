import { FieldOptions, handleRequest, loadUserContext, validateSchema } from '@middlewares'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppDependencies from 'appDependencies'
import { SeenContentController } from '@controllers'
import {
    AddSeenEpisodeSchema, AddSeenMovieSchema,
    AddSeenSeasonSchema, AddSeenSeriesSchema, GetAllContentListSchema, GetContentListSchema
} from '@dtos'

export function SeenContentRouter(dependencies: AppDependencies) {
    const router = Router()
    const seenContentController = new SeenContentController(dependencies)

    router.post(
        '/',
        loadUserContext,
        handleRequest((req, res) => seenContentController.create(req, res), StatusCodes.CREATED)
    )

    router.get(
        "/",
        validateSchema(GetAllContentListSchema, [FieldOptions.query]),
        handleRequest((req, res) => seenContentController.getAll(req, res), StatusCodes.OK)
    )

    router.get(
        '/:userId',
        loadUserContext,
        validateSchema(GetContentListSchema, [FieldOptions.params, FieldOptions.query]),
        handleRequest((req, res) => seenContentController.getSeenContent(req, res), StatusCodes.OK)
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
        validateSchema(AddSeenMovieSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.addMovie(req, res), StatusCodes.CREATED)
    )

    router.delete(
        '/movies/:movieId',
        loadUserContext,
        validateSchema(AddSeenMovieSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.removeMovie(req, res), StatusCodes.OK)
    )

    router.put(
        '/series/:seriesId',
        loadUserContext,
        validateSchema(AddSeenSeriesSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.addSeries(req, res), StatusCodes.CREATED)
    )

    router.delete(
        '/series/:seriesId',
        loadUserContext,
        validateSchema(AddSeenSeriesSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.removeSeries(req, res), StatusCodes.OK)
    )

    router.put(
        '/series/:seriesId/seasons/:seasonId',
        loadUserContext,
        validateSchema(AddSeenSeasonSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.addSeason(req, res), StatusCodes.CREATED)
    )

    router.delete(
        '/series/:seriesId/seasons/:seasonId',
        loadUserContext,
        validateSchema(AddSeenSeasonSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.removeSeason(req, res), StatusCodes.OK)
    )

    router.put(
        '/series/:seriesId/seasons/:seasonId/episodes/:episodeId',
        loadUserContext,
        validateSchema(AddSeenEpisodeSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.addEpisode(req, res), StatusCodes.CREATED)
    )

    router.delete(
        '/series/:seriesId/seasons/:seasonId/episodes/:episodeId',
        loadUserContext,
        validateSchema(AddSeenEpisodeSchema, [FieldOptions.params]),
        handleRequest((req, res) => seenContentController.removeEpisode(req, res), StatusCodes.OK)
    )

    return router
}
