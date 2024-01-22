
import { GetMovieDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';

export class MovieController {
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
    }

    public async getMovie(req: Request<GetMovieDto>) {
        const country = req.query.country as string;
        console.log(country)
        return await this.tmdbService.getMovie(req.params.movieId, country);
    }

    public async searchMovie(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = res.locals.userId;
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string || '1');
        return await this.tmdbService.searchMovie(userId, query, page);
    }

}
