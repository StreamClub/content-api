
import { GetMovieDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';

export class MovieController {
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
    }

    public async getMovie(req: Request<GetMovieDto>, res: Response<any>) {
        const country = req.query.country as string;
        const movieId = parseInt(req.params.movieId);
        const userId = Number(res.locals.userId);
        return await this.tmdbService.getMovie(userId, movieId, country);
    }

    public async searchMovie(req: Request<GetMovieDto>, res: Response<any>) {
        const country = req.query.country as string;
        const userId = Number(res.locals.userId);
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string || '1');
        return await this.tmdbService.searchMovie(userId, query, page, country);
    }

}
