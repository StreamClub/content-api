import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { SeenContentService, TmdbService } from '@services';
import { Season, SeasonEpisode, SeenEpisode, SeenItem, SeenMovieItemResume, SeenSeason, SeenSeriesItem, SeenSeriesItemResume } from '@entities';
import moment from 'moment';
import { SPECIALS_SEASON_ID } from '@config';
import { EpisodeHasNotAiredException } from '@exceptions';

export class SeenContentController {
    private seenContentService: SeenContentService;
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.seenContentService = new SeenContentService(dependencies);
        this.tmdbService = new TmdbService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.seenContentService.create(userId);
    }

    public async getSeenContent(req: Request<any>, res: Response<any>) {
        const userId = Number(req.params.userId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        const seenContent = await this.seenContentService.getSeenContent(userId, pageSize, pageNumber);
        seenContent.results = await Promise.all(seenContent.results.map(async (content: SeenItem) => {
            if (content.contentType === 'series') {
                const seriesBasicInfo = await this.tmdbService.getSeriesBasicInfo(content.id);
                return new SeenSeriesItemResume(content as SeenSeriesItem, seriesBasicInfo);
            } else {
                const poster = await
                    this.tmdbService.getPoster(content.contentType, content.id);
                return new SeenMovieItemResume(content, poster);
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
            const episodes: SeenEpisode[] = seasonInfo.toSeenEpisodes();
            latestSeenEpisode = seasonInfo.getLatestEpisode(latestSeenEpisode);
            return new SeenSeason({ seasonId: season.id, episodes });
        }));
        return await this.seenContentService.addSeries(userId, seriesId, seenSeasons, latestSeenEpisode);
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
        const episodes: SeenEpisode[] = season.toSeenEpisodes();
        const lastSeenEpisode = season.getLatestEpisode(null);
        return await this.seenContentService.addSeason(userId, seriesId, seasonId, episodes, lastSeenEpisode);
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
