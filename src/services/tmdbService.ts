import { Movie, TmdbMovie } from "@entities";
import AppDependencies from "appDependencies";
import { MovieDb } from 'moviedb-promise'

export class TmdbService {
    private tmdb: MovieDb;
    private language = 'es';
    public constructor(dependencies: AppDependencies) {
        this.tmdb = new MovieDb(process.env.TMDB_API_KEY);
    }

    public async getMovie(movieId: string, country: string): Promise<Movie> {
        const movie = await this.tmdb.movieInfo({
            id: movieId, language: this.language,
            append_to_response: 'credits,watch/providers,recommendations,videos'
        }) as TmdbMovie;
        console.log(movie.videos);
        return new Movie(movie, country);
    }

    public async searchMovie(query: string) {
        return await this.tmdb.searchMovie({ query, language: this.language });
    }
}
