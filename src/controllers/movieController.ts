
import { GetMovieDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request } from '@models';

export class MovieController {
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
    }

    public async getMovie(req: Request<GetMovieDto>) {
        return await this.tmdbService.getMovie(req.params.movieId);
    }

}
