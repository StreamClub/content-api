import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { SeenContentService, TmdbService } from '@services';
import { SeasonEpisode, SeenEpisode, SeenSeason } from '@entities';
import moment from 'moment';
import { SPECIALS_SEASON_ID } from '@config';

export class SeenContentController {
    private seenContentService: SeenContentService;
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.seenContentService = new SeenContentService(dependencies);
        this.tmdbService = new TmdbService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        return await this.seenContentService.create(userId);
    }

    public async getMovies(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        return await this.seenContentService.getMovies(userId, pageSize, pageNumber);
    }

    public async addMovie(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const movieId = req.params.movieId;
        return await this.seenContentService.addMovie(userId, Number(movieId));
    }

    public async removeMovie(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const movieId = req.params.movieId;
        return await this.seenContentService.removeMovie(userId, Number(movieId));
    }

    public async addSeries(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const seriesId = Number(req.params.seriesId);
        const series = await this.tmdbService.getSeries(userId, seriesId, 'AR');
        const seasons = series.seasons.filter(season => season.id !== SPECIALS_SEASON_ID);
        const seenSeasons: SeenSeason[] = await Promise.all(seasons.map(async (season) => {
            const seasonInfo = await this.tmdbService.getSeason(userId, seriesId, season.id, 'AR');
            const episodes: SeenEpisode[] = seasonInfo.episodes.map((episode: SeasonEpisode) => {
                const airDate = moment(episode.airDate).format('YYYY-MM-DD');
                if (airDate <= moment().format('YYYY-MM-DD')) {
                    return { episodeId: episode.episodeNumber };
                }
            });
            const airedEpisodes: SeenEpisode[] = episodes.filter(episode => episode);
            return new SeenSeason({ seasonId: season.id, episodes: airedEpisodes });
        }));
        return await this.seenContentService.addSeries(userId, seriesId, seenSeasons);
    }


    public async addSeason(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        const season = await this.tmdbService.getSeason(userId, seriesId, seasonId, 'AR');
        const episodes: SeenEpisode[] = season.episodes.map((episode: SeasonEpisode) => {
            return { episodeId: episode.episodeNumber }
        });
        return await this.seenContentService.addSeason(userId, seriesId, seasonId, episodes);
    }

    public async removeSeason(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        return await this.seenContentService.removeSeason(userId, seriesId, seasonId);
    }

    public async addEpisode(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const seriesId = req.params.seriesId;
        const seasonId = req.params.seasonId;
        const episodeId = req.params.episodeId;
        return await this.seenContentService.addEpisode(userId, Number(seriesId), Number(seasonId), Number(episodeId));
    }

    public async removeEpisode(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const seriesId = req.params.seriesId;
        const seasonId = req.params.seasonId;
        const episodeId = req.params.episodeId;
        return await this.seenContentService.removeEpisode(userId, Number(seriesId), Number(seasonId), Number(episodeId));
    }

}
