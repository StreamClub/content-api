import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { ReviewService, SeenContentService, StreamProviderService, TmdbService } from '@services';
import {
    Season, SeasonEpisode, SeenEpisode, SeenItem, SeenMovieItemResume,
    SeenSeason, SeenSeriesItem, SeenSeriesItemResume,
    Series
} from '@entities';
import moment from 'moment';
import { SPECIALS_SEASON_ID } from '@config';
import { EpisodeHasNotAiredException } from '@exceptions';

export class SeenContentController {
    private seenContentService: SeenContentService;
    private reviewService: ReviewService;
    private tmdbService: TmdbService;
    private streamProviderService: StreamProviderService;

    public constructor(dependencies: AppDependencies) {
        this.seenContentService = new SeenContentService(dependencies);
        this.tmdbService = new TmdbService(dependencies);
        this.reviewService = new ReviewService(dependencies);
        this.streamProviderService = new StreamProviderService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.seenContentService.create(userId);
    }

    public async getAll(req: Request<any>, res: Response<any>) {
        const pageNumber = Number(req.query.page) || 1;
        const pageSize = 1;
        return await this.seenContentService.getAll(pageSize, pageNumber);
    }

    public async getSeenContent(req: Request<any>, res: Response<any>) {
        const requesterId = Number(res.locals.userId);
        const userId = Number(req.params.userId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        const seenContent = await this.seenContentService.getSeenContent(userId, pageSize, pageNumber, requesterId);
        seenContent.results = await Promise.all(seenContent.results.map(async (content: SeenItem) => {
            const review = await this.reviewService.getReview(userId, content.id, content.contentType);
            if (content.contentType === 'series') {
                const seriesBasicInfo = await this.tmdbService.getSeriesBasicInfo(content.id);
                const seenSeries = new SeenSeriesItemResume(content as SeenSeriesItem, seriesBasicInfo);
                seenSeries.hasReview = review?.review !== undefined;
                seenSeries.liked = review?.liked;
                return seenSeries;
            } else {
                const { poster, title } = await
                    this.tmdbService.getNameAndPoster(content.contentType, content.id);
                const seenMovie = new SeenMovieItemResume(content, poster, title);
                seenMovie.hasReview = review?.review !== undefined;
                seenMovie.liked = review?.liked;
                return seenMovie;
            }
        }));
        return seenContent;
    }

    public async getMovies(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        return await this.seenContentService.getMovies(userId, pageSize, pageNumber);
    }

    public async addMovie(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const movieId = req.params.movieId;
        const movie = await this.tmdbService.getMovie(userId, Number(movieId), 'AR');
        const isSeenMovie = await this.seenContentService.isASeenMovie(userId, Number(movieId));
        if (!isSeenMovie) {
            await this.streamProviderService.addWatchedTime(userId, movie.runtime,
                movie.platforms.map(platform => platform.providerId));
        }
        return await this.seenContentService.addMovie(userId, Number(movieId));
    }

    public async removeMovie(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const movieId = req.params.movieId;
        const movie = await this.tmdbService.getMovie(userId, Number(movieId), 'AR');
        const seenDate = await this.seenContentService.getMovieSeenDate(userId, Number(movieId));
        if (seenDate) {
            await this.streamProviderService.removeWatchedTime(userId, movie.runtime,
                movie.platforms.map(platform => platform.providerId), seenDate);
        }
        return await this.seenContentService.removeMovie(userId, Number(movieId));
    }

    public async addSeries(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const series = await this.tmdbService.getSeries(userId, seriesId, 'AR');
        const seasons = series.seasons.filter(season => season.id !== SPECIALS_SEASON_ID);
        let latestSeenEpisode: SeasonEpisode = null;
        const seenSeasons: SeenSeason[] = await Promise.all(seasons.map(async (season) => {
            const seasonInfo: Season = await this.tmdbService.getSeason(seriesId, season.id);
            if (seasonInfo.episodes.length !== 0) {
                const episodes: SeenEpisode[] = seasonInfo.toSeenEpisodes();
                latestSeenEpisode = seasonInfo.getLatestEpisode(latestSeenEpisode);
                return new SeenSeason(season.id, episodes);
            }
        }));
        const filteredSeenSeasons = seenSeasons.filter(season => season !== undefined);
        const seenContent = await this.seenContentService.getSeenContentList(userId);
        const seenSeries = seenContent.series.find(series => series.seriesId === seriesId);
        const totalWatchedTime = filteredSeenSeasons.map(season => {
            const unseenEpisodes = season.getUnseenSeasonEpisodes(seenSeries);
            return unseenEpisodes
                .reduce((acc, episode) => acc + Number(episode.runtime), 0);
        }).reduce((acc, runtime) => acc + runtime, 0);
        await this.streamProviderService.addWatchedTime(userId, totalWatchedTime,
            series.platforms.map(platform => platform.providerId));
        await this.seenContentService
            .addSeries(userId, seriesId, filteredSeenSeasons, latestSeenEpisode);
        return await this.tmdbService.getSeriesSeenPercentage(userId, seriesId);
    }

    public async removeSeries(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const series = await this.tmdbService.getSeries(userId, seriesId, 'AR');
        for (const season of series.seasons) {
            await this.removeSeasonWatchedTime(userId, series, season.id);
        }
        await this.seenContentService.removeSeries(userId, seriesId);
        return await this.tmdbService.getSeriesSeenPercentage(userId, seriesId);

    }

    public async addSeason(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        const season = await this.tmdbService.getSeason(seriesId, seasonId);
        const series = await this.tmdbService.getSeries(userId, seriesId, 'AR');
        if (season.episodes.length !== 0) {
            const seenContent = await this.seenContentService.getSeenContentList(userId);
            const seenSeries = seenContent.series.find(series => series.seriesId === seriesId);
            const episodes: SeenEpisode[] = season.toSeenEpisodes();
            const seenSeason = new SeenSeason(seasonId, episodes);
            const lastSeenEpisode = season.getLatestEpisode(null);
            const unseenEpisodes = seenSeason.getUnseenSeasonEpisodes(seenSeries);
            const totalWatchedTime = unseenEpisodes
                .reduce((acc, episode) => acc + Number(episode.runtime), 0);
            await this.streamProviderService.addWatchedTime(userId, totalWatchedTime,
                series.platforms.map(platform => platform.providerId));
            await this.seenContentService
                .addSeason(userId, seriesId, seenSeries, seenSeason, lastSeenEpisode);
            return await this.tmdbService.getSeriesSeenPercentage(userId, seriesId);
        }
    }

    public async removeSeason(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        const series = await this.tmdbService.getSeries(userId, seriesId, 'AR');
        await this.removeSeasonWatchedTime(userId, series, seasonId);
        await this.seenContentService.removeSeason(userId, seriesId, seasonId);
        return await this.tmdbService.getSeriesSeenPercentage(userId, seriesId);
    }

    public async addEpisode(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        const episodeId = Number(req.params.episodeId);
        const series = await this.tmdbService.getSeries(userId, seriesId, 'AR');
        const episode: SeasonEpisode = await this.tmdbService.getEpisode(seriesId, seasonId, episodeId);
        if (moment(episode.airDate).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) {
            throw new EpisodeHasNotAiredException();
        }
        const isSeenEpisode = await this.seenContentService.isASeenEpisode(userId, seriesId, seasonId, episodeId);
        if (!isSeenEpisode) {
            await this.streamProviderService.addWatchedTime(userId, Number(episode.runtime),
                series.platforms.map(platform => platform.providerId));
        }
        await this.seenContentService.addEpisode(userId, seriesId, seasonId, episodeId);
        return await this.tmdbService.getSeriesSeenPercentage(userId, seriesId);
    }

    public async removeEpisode(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        const episodeId = Number(req.params.episodeId);
        const series = await this.tmdbService.getSeries(userId, seriesId, 'AR');
        await this.removeEpisodeWatchedTime(userId, series, seasonId, episodeId);
        await this.seenContentService.removeEpisode(userId, seriesId, seasonId, episodeId);
        return await this.tmdbService.getSeriesSeenPercentage(userId, seriesId);

    }

    private async removeSeasonWatchedTime(userId: number, series: Series, seasonId: number) {
        const season = await this.tmdbService.getSeason(series.id, seasonId);
        for (const episode of season.episodes) {
            await this.removeEpisodeWatchedTime(userId, series, seasonId, episode.episodeId);
        }
    }

    private async removeEpisodeWatchedTime(userId: number, series: Series, seasonId: number, episodeId: number) {
        const episode: SeasonEpisode = await this.tmdbService.getEpisode(series.id, seasonId, episodeId);
        const seenDate = await this.seenContentService.getEpisodeSeenDate(userId, series.id, seasonId, episodeId);
        if (seenDate) {
            await this.streamProviderService.removeWatchedTime(userId, Number(episode.runtime),
                series.platforms.map(platform => platform.providerId), seenDate);
        }
    }

}
