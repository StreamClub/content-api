
import { GetMovieDto, GetContentResumeDto } from '@dtos';
import { PrivacyService, SeenContentService, TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { contentTypes } from '@config';

export class MovieController {
    private tmdbService: TmdbService;
    private seenContentService: SeenContentService;
    private privacyService: PrivacyService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
        this.seenContentService = new SeenContentService(dependencies);
        this.privacyService = new PrivacyService(dependencies);
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

    public async getMoviesResume(req: Request<GetContentResumeDto>, res: Response<any>) {
        const query = (req.query.ids as string).split(',');
        const userId = Number(res.locals.userId);
        const moviesIds = query.map((ids) => Number(ids));
        let movies = [];
        for (const id of moviesIds) {
            const movie = await this.tmdbService.getMovieResume(id, userId);
            if (movie) movies.push(movie);
        }
        return movies;
    }

    public async getFriendsRecommendations(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const friendsIds = (req.query.friendsIds as string).split(',').map((id: string) => Number(id));
        const filteredFriendsIds = await this.privacyService.filterIdsWithSeenContentListPublic(friendsIds);
        const recommendations = await this.seenContentService
            .getFriendsRecommendations(userId, filteredFriendsIds, contentTypes.MOVIE);
        let movies = [];
        for (const id of recommendations.recommendations) {
            const movie = await this.tmdbService.getMovieResume(id, userId);
            if (movie) movies.push(movie);
        }
        return { recommendations: movies };
    }

    public async getSimilarMovies(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const movieIds = (req.query.movieIds as string).split(',').map((id: string) => Number(id));
        let genders: string[] = [];
        let minDuration = 2147483647;
        let maxDuration = 0;
        for (const id of movieIds) {
            const movie = await this.tmdbService.getMovieResume(id, userId);
            if (movie) {
                if (movie.duration < minDuration) minDuration = movie.duration;
                if (movie.duration > maxDuration) maxDuration = movie.duration;
                for (const genre of movie.genresIds) {
                    if (!genders.includes(genre)) genders.push(genre);
                }

            }
        }
        return await this.tmdbService.discoverMovies(userId, 1, 'AR', genders,
            minDuration, maxDuration, false);
    }

    public async getMovieCredits(req: Request<GetMovieDto>, res: Response<any>) {
        const movieId = parseInt(req.params.movieId);
        return await this.tmdbService.getContentCredits(movieId, contentTypes.MOVIE);
    }

}
