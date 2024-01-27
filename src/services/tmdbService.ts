import { contentTypes } from "@config";
import { watchlistRepository } from "@dal";
import { Movie, TmdbMovie, MovieResume, SeriesResume, PaginatedResult } from "@entities";
import { NotFoundException } from "@exceptions";
import { getRedirectLinks } from "@utils";
import AppDependencies from "appDependencies";
import { MovieDb, MovieResult, TvResult } from 'moviedb-promise'

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
            const providersUrl = this.getMovieProvidersUrl(movieId, country);
            const providersData = await getRedirectLinks(providersUrl);
            return new Movie(movie, country, providersData);
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
            movieResume.inWatchlist = await watchlistRepository
                .isInWatchlist(userId, movie.id.toString(), contentTypes.MOVIE);
            return movieResume;
        }));
        return {
            page: result.page,
            total_pages: result.total_pages,
            total_results: result.total_results,
            results: movies
        };
    }

    public async searchSeries(userId: string, query: string, page: number) {
        const result = await this.tmdb.searchTv({ query, language: this.language, page });
        const series = await Promise.all(result.results.map(async (serie: TvResult) => {
            const serieResume = new SeriesResume(serie)
            serieResume.inWatchlist = await watchlistRepository
                .isInWatchlist(userId, serie.id.toString(), contentTypes.SERIES);
            const showDetails = await this.tmdb.tvInfo({ id: serie.id, language: this.language });
            serieResume.status = showDetails.status;
            serieResume.lastEpisodeReleaseDate = showDetails.last_episode_to_air?.air_date;
            return serieResume;
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, series);
    }


    private getMovieProvidersUrl(movieId: string, country: string) {
        return `https://www.themoviedb.org/movie/${movieId}/watch?locale=${country}`;
    }
}
