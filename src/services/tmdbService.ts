import { contentTypes } from "@config";
import { WatchlistRepository } from "@dal";
import { Movie, TmdbMovie, MovieResume } from "@entities";
import { NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";
import { MovieDb, MovieResult } from 'moviedb-promise'

export class TmdbService {
    private tmdb: MovieDb;
    private watchlistRepository: WatchlistRepository
    private language = 'es';
    public constructor(dependencies: AppDependencies) {
        this.tmdb = new MovieDb(process.env.TMDB_API_KEY);
        this.watchlistRepository = new WatchlistRepository();
    }

    public async getMovie(movieId: string, country: string): Promise<Movie> {
        try {

            const movie = await this.tmdb.movieInfo({
                id: movieId, language: this.language,
                append_to_response: 'credits,watch/providers,recommendations,videos'
            }) as TmdbMovie;
            return new Movie(movie, country);
        } catch (error) {
            if (error.response.status === 404) {
                throw new NotFoundException('La película no existe');
            }
            throw error;
        }
    }

    public async searchMovie(userId: string, query: string, page: number) {
        const result = await this.tmdb.searchMovie({ query, language: this.language, page });
        const movies = await Promise.all(result.results.map(async (movie: MovieResult) => {
            const movieResume = new MovieResume(movie)
            movieResume.inWatchlist = await this
                .watchlistRepository.isInWatchlist(userId, movie.id.toString(), contentTypes.MOVIE);
            return movieResume;
        }));
        return {
            page: result.page,
            total_pages: result.total_pages,
            total_results: result.total_results,
            results: movies
        };

    }
}
