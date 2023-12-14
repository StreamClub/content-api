import AppDependencies from "appDependencies";
import { MovieDb } from 'moviedb-promise'

export class TmdbService {
    private tmdb: MovieDb;
    public constructor(dependencies: AppDependencies) {
        this.tmdb = new MovieDb(process.env.TMDB_API_KEY);
    }

    public async getMovie(movieId: string) {
        const movie = await this.tmdb.movieInfo({ id: movieId, language: 'es' });
        return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: movie.poster_path,
            backdrop: movie.backdrop_path,
            genres: movie.genres.map((genre) => genre.name),
            releaseDate: movie.release_date,
            runtime: movie.runtime,
            revenue: movie.revenue,
            status: movie.status,

        };
    }
}
