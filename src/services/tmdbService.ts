import { contentTypes, seriesStatus } from "@config";
import { watchlistRepository } from "@dal";
import { Movie, TmdbMovie, MovieResume, SeriesResume, PaginatedResult, TmdbSeries, Series, NextEpisode, Season, ArtistResume, TmdbPerson, Artist } from "@entities";
import { NotFoundException } from "@exceptions";
import { getRedirectLinks } from "@utils";
import AppDependencies from "appDependencies";
import { MovieDb, MovieResult, TvResult, TvSeasonResponse } from 'moviedb-promise'

export class TmdbService {
    private tmdb: MovieDb;
    private language = 'es';
    private contentTypes = {
        MOVIE: 'movie',
        SERIES: 'tv'
    }

    public constructor(dependencies: AppDependencies) {
        this.tmdb = new MovieDb(process.env.TMDB_API_KEY);
    }

    public async getMovie(movieId: string, country: string): Promise<Movie> {
        return await this.getContentSafely(async () => {
            const movie = await this.tmdb.movieInfo({
                id: movieId, language: this.language,
                append_to_response: 'credits,watch/providers,recommendations,videos'
            }) as TmdbMovie;
            const providersData = await this.getProvidersData(this.contentTypes.MOVIE, movieId, country);
            return new Movie(movie, country, providersData);
        })
    }

    public async getSeries(userId: string, seriesId: string, country: string) {
        return await this.getContentSafely(async () => {
            const serie = await this.tmdb.tvInfo({
                id: seriesId, language: this.language,
                append_to_response: 'credits,watch/providers,recommendations,videos'
            }) as TmdbSeries;
            const nextEpisode = await this.getNextEpisode(userId, serie.id, serie.seasons, country);
            const providersData = await this.getProvidersData(this.contentTypes.SERIES, seriesId, country);
            return new Series(serie, country, providersData, nextEpisode);
        })
    }

    public async getArtist(artistId: string) {
        return await this.getContentSafely(async () => {
            const tmdbPerson = await this.tmdb.personInfo({
                id: artistId, language: this.language,
                append_to_response: 'combined_credits,external_ids'
            }) as TmdbPerson;
            return new Artist(tmdbPerson);
        });
    }

    private async getNextEpisode(userId: string, serieId: number, seasons: TvSeasonResponse[], country: string) {
        const filtered = seasons.filter(season => season.season_number > 0);
        if (filtered.length > 0) {
            const season = await this.getSeason(userId, serieId, filtered[0].season_number, country);
            return new NextEpisode(season.episodes[0]);
        }
    }

    public async getSeason(userId: string, serieId: number, seasonNumber: number, country: string) {
        return await this.getContentSafely(async () => {
            const season = await this.tmdb.seasonInfo({ id: serieId, season_number: seasonNumber, language: this.language });
            return new Season(season);
        });
    }

    public async searchMovie(userId: string, query: string, page: number) {
        const result = await this.tmdb.searchMovie({ query, language: this.language, page });
        const movies = await Promise.all(result.results.map(async (movie: MovieResult) => {
            const movieResume = new MovieResume(movie)
            movieResume.inWatchlist = await watchlistRepository
                .isInWatchlist(userId, movie.id.toString(), contentTypes.MOVIE);
            return movieResume;
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, movies);
    }

    public async searchSeries(userId: string, query: string, page: number) {
        const result = await this.tmdb.searchTv({ query, language: this.language, page });
        const series = await Promise.all(result.results.map(async (serie: TvResult) => {
            const serieResume = new SeriesResume(serie)
            serieResume.inWatchlist = await watchlistRepository
                .isInWatchlist(userId, serie.id.toString(), contentTypes.SERIES);
            const showDetails = await this.tmdb.tvInfo({ id: serie.id, language: this.language });
            serieResume.status = seriesStatus[showDetails.status];
            serieResume.lastEpisodeReleaseDate = showDetails.last_episode_to_air?.air_date;
            return serieResume;
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, series);
    }

    public async searchArtist(userId: string, query: string, page: number) {
        const result = await this.tmdb.searchPerson({ query, language: this.language, page });
        const artists = await Promise.all(result.results.map(async (artist) => {
            const artistDetail = await this.tmdb.personInfo({ id: artist.id, language: this.language });
            return new ArtistResume(artistDetail);
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, artists);
    }

    private async getProvidersData(contentType: string, contentId: string, country: string) {
        const providersUrl = `https://www.themoviedb.org/${contentType}/${contentId}/watch?locale=${country}`;
        return await getRedirectLinks(providersUrl);
    }

    private async getContentSafely(callback: Function) {
        try {
            return await callback();
        } catch (error) {
            if (error?.response?.status === 404) {
                throw new NotFoundException('El contenido no existe');
            }
            throw error;
        }
    }

}
