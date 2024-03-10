
import { GetMovieDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { contentTypes } from '@config';

export class SeriesController {
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
    }

    public async searchSeries(req: Request<GetMovieDto>, res: Response<any>) {
        const country = req.query.country as string;
        const userId = Number(res.locals.userId);
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string || '1');
        return await this.tmdbService.searchSeries(userId, query, page, country);
    }

    public async getSeries(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const country = req.query.country as string;
        const seriesId = Number(req.params.seriesId);
        return await this.tmdbService.getSeries(userId, seriesId, country);
    }

    public async getSeason(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        return await this.tmdbService.getUserSeason(userId, seriesId, seasonId);
    }

    public async getSeriesCredits(req: Request<GetMovieDto>, res: Response<any>) {
        const seriesId = Number(req.params.seriesId);
        return await this.tmdbService.getContentCredits(seriesId, contentTypes.SERIES);
    }

}
