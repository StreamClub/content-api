import AppDependencies from "appDependencies";
import { MovieDb } from 'moviedb-promise'

export class TmdbService {
    private tmdb: MovieDb;
    private language = 'es';
    public constructor(dependencies: AppDependencies) {
        this.tmdb = new MovieDb(process.env.TMDB_API_KEY);
    }

    public async getMovie(movieId: string, country: string = 'AR') {
        const movie = await this.tmdb.movieInfo({ id: movieId, language: this.language });
        const platforms = await this.tmdb.movieWatchProviders({ id: movieId });
        const credits = await this.tmdb.movieCredits({ id: movieId });

        const countryPlatforms = Object.entries(platforms.results).filter(([key, _]) => {
            return key === country;
        });
        const countryData = countryPlatforms.length > 0 ? countryPlatforms[0][1] : null;
        const director = credits.crew.filter((crew) => crew.job === 'Director').map((crew) => crew.name);
        const cast = credits.cast.slice(0, 10);

        return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: movie.poster_path,
            backdrop: movie.backdrop_path,
            genres: movie.genres.map((genre) => genre.name),
            releaseDate: movie.release_date,
            runtime: movie.runtime,
            budget: movie.budget,
            revenue: movie.revenue,
            status: movie.status,
            platforms: countryData,
            director: director,
            cast: cast,
        };
    }
}
