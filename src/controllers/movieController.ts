
import { GetMovieDto, GetContentResumeDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { contentTypes } from '@config';

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

    public async discoverMovies(req: Request<GetMovieDto>, res: Response<any>) {
        const country = req.query.country as string;
        const userId = Number(res.locals.userId);
        const page = parseInt(req.query.page as string || '1');
        const genderIds = (req.query.genderIds ? req.query.genderIds as string : '').split(',');
        const runtimeGte = parseInt(req.query.runtimeGte as string || '0');
        const runtimeLte = parseInt(req.query.runtimeLte as string || '2147483647');
        const inMyPlatforms = req.query.inMyPlatforms === 'true';
        return await this.tmdbService.discoverMovies(userId, page, country, genderIds,
            runtimeGte, runtimeLte, inMyPlatforms);
    }

    public async getMoviesResume(req: Request<GetContentResumeDto>) {
        const query = (req.query.ids as string).split(',');
        const moviesIds = query.map((ids) => Number(ids));
        let movies = [];
        for (const id of moviesIds) {
            const movie = await this.tmdbService.getMovieResume(id);
            if (movie) movies.push(movie);
        }
        return movies;
    }

    public async getMovieCredits(req: Request<GetMovieDto>, res: Response<any>) {
        const movieId = parseInt(req.params.movieId);
        return await this.tmdbService.getContentCredits(movieId, contentTypes.MOVIE);
    }

}
