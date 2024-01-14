import { Movie, TmdbMovie } from "@entities";
import { MovieResume } from "@entities/movies/movieResume";
import { NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";
import { MovieDb, MovieResult } from 'moviedb-promise'

export class TmdbService {
    private tmdb: MovieDb;
    private language = 'es';
    public constructor(dependencies: AppDependencies) {
        this.tmdb = new MovieDb(process.env.TMDB_API_KEY);
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

    public async searchMovie(query: string, page: number) {
        const result = await this.tmdb.searchMovie({ query, language: this.language, page });
        const movies = result.results.map((movie: MovieResult) => new MovieResume(movie));
        return {
            page: result.page,
            total_pages: result.total_pages,
            total_results: result.total_results,
            results: movies
        };

    }
}
