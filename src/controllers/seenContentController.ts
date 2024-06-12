import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { ReviewService, SeenContentService, TmdbService } from '@services';
import {
    Season, SeasonEpisode, SeenEpisode, SeenItem, SeenMovieItemResume,
    SeenSeason, SeenSeriesItem, SeenSeriesItemResume
} from '@entities';
import moment from 'moment';
import { SPECIALS_SEASON_ID } from '@config';
import { EpisodeHasNotAiredException } from '@exceptions';

export class SeenContentController {
    private seenContentService: SeenContentService;
    private reviewService: ReviewService;
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.seenContentService = new SeenContentService(dependencies);
        this.tmdbService = new TmdbService(dependencies);
        this.reviewService = new ReviewService(dependencies);
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

    public async getPrivacy(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.seenContentService.getPrivacy(userId);
    }

    public async updatePrivacy(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.seenContentService.updatePrivacy(userId, req.body.isSeenContentListPrivate);
    }

    public async getSeenContent(req: Request<any>, res: Response<any>) {
        const userId = Number(req.params.userId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        const seenContent = await this.seenContentService.getSeenContent(userId, pageSize, pageNumber);
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
        return await this.seenContentService.addMovie(userId, Number(movieId));
    }

    public async removeMovie(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const movieId = req.params.movieId;
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
                return new SeenSeason({ seasonId: season.id, episodes });
            }
        }));
        const filteredSeenSeasons = seenSeasons.filter(season => season !== undefined);
        return await this.seenContentService
            .addSeries(userId, seriesId, filteredSeenSeasons, latestSeenEpisode);
    }

    public async removeSeries(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        return await this.seenContentService.removeSeries(userId, seriesId);
    }

    public async addSeason(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        const season = await this.tmdbService.getSeason(seriesId, seasonId);
        if (season.episodes.length !== 0) {
            const episodes: SeenEpisode[] = season.toSeenEpisodes();
            const lastSeenEpisode = season.getLatestEpisode(null);
            return await this.seenContentService.addSeason(userId, seriesId, seasonId, episodes, lastSeenEpisode);
        }
    }

    public async removeSeason(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        return await this.seenContentService.removeSeason(userId, seriesId, seasonId);
    }

    public async addEpisode(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        const episodeId = Number(req.params.episodeId);
        const episode: SeasonEpisode = await this.tmdbService.getEpisode(seriesId, seasonId, episodeId);
        if (moment(episode.airDate).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) {
            throw new EpisodeHasNotAiredException();
        }
        return await this.seenContentService.addEpisode(userId, seriesId, seasonId, episodeId);
    }

    public async removeEpisode(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = req.params.seriesId;
        const seasonId = req.params.seasonId;
        const episodeId = req.params.episodeId;
        return await this.seenContentService.removeEpisode(userId, Number(seriesId), Number(seasonId), Number(episodeId));
    }

}
