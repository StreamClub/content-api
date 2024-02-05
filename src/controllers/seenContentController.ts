import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { SeenContentService } from '@services';

export class SeenContentController {
    private seenContentService: SeenContentService;

    public constructor(dependencies: AppDependencies) {
        this.seenContentService = new SeenContentService(dependencies);
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

    public async addEpisode(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        const seriesId = req.params.seriesId;
        const seasonId = req.params.seasonId;
        const episodeId = req.params.episodeId;
        return await this.seenContentService.addEpisode(userId, Number(seriesId), Number(seasonId), Number(episodeId));
    }

}
