import { config, contentTypes } from "@config";
import {
    Movie, TmdbMovie, MovieResume, SeriesResume, PaginatedResult,
    TmdbSeries, Series, LastSeenEpisode, Season, ArtistResume, TmdbPerson, Artist, SeenEpisode, SeriesBasicInfo, Platform, ContentCredits,
    MovieRecommendation,
    SeriesRecommendation
} from "@entities";
import { NotFoundException } from "@exceptions";
import { ReviewService, SeenContentService, StreamProviderService, WatchlistService } from "@services";
import { getRedirectLinks, logger } from "@utils";
import AppDependencies from "appDependencies";
import { MovieDb, MovieResponse, MovieResult, ShowResponse, TvResult, TvSeasonResponse } from 'moviedb-promise'

export class TmdbService {
    private tmdb: MovieDb;
    private language = 'es';
    private tmdbContentTypes = {
        MOVIE: 'movie',
        SERIES: 'tv'
    }
    private streamProviderService: StreamProviderService;
    private seenContentService: SeenContentService;
    private watchlistService: WatchlistService;
    private reviewService: ReviewService;

    public constructor(dependencies: AppDependencies) {
        this.tmdb = new MovieDb(config.tmdbApiKey);
        this.streamProviderService = new StreamProviderService(dependencies);
        this.seenContentService = new SeenContentService(dependencies);
        this.watchlistService = new WatchlistService(dependencies);
        this.reviewService = new ReviewService(dependencies);
    }

    public async getMovie(userId: number, movieId: number, country: string): Promise<Movie> {
        const scMovie = await this.getStreamClubMovie(movieId, country);
        const providersData = await this.getContentProviders(this.tmdbContentTypes.MOVIE, movieId, country);
        const userPlatforms = await this.streamProviderService.getAll(userId);
        scMovie.setProviders(providersData, userPlatforms.providerId);
        scMovie.inWatchlist = await this.watchlistService
            .isInWatchlist(userId, scMovie.id.toString(), contentTypes.MOVIE);
        scMovie.seen = await this.seenContentService
            .isASeenMovie(userId, scMovie.id);
        scMovie.userReview = await this.reviewService.getReview(userId, scMovie.id, contentTypes.MOVIE);
        return scMovie;
    }

    public async getContentCredits(contentId: number, contentType: string) {
        return await this.getContentSafely(async () => {
            let credits;
            if (contentType == contentTypes.MOVIE) {
                credits = await this.tmdb.movieCredits({ id: contentId, language: this.language });
            } else {
                credits = await this.tmdb.tvCredits({ id: contentId, language: this.language });
            }
            return new ContentCredits(credits);
        });
    }

    private async getStreamClubMovie(movieId: number, country: string): Promise<Movie> {
        return await this.getContentSafely(async () => {
            const movie = await this.tmdb.movieInfo({
                id: movieId, language: this.language,
                append_to_response: 'credits,watch/providers,recommendations'
            }) as TmdbMovie;
            return new Movie(movie, country);
        })
    }

    public async getMovieResume(movieId: number, userId: number) {
        return await this.getResumeSafely(movieId, async () => {
            const movie = await this.tmdb.movieInfo({ id: movieId, language: this.language });
            const recommendation = new MovieRecommendation(movie);
            recommendation.inWatchlist = await this.watchlistService
                .isInWatchlist(userId, recommendation.id.toString(), contentTypes.MOVIE);
            return recommendation;
        });
    }

    public async getSeriesResume(seriesId: number, userId: number) {
        return await this.getResumeSafely(seriesId, async () => {
            const serie = await this.tmdb.tvInfo({ id: seriesId, language: this.language });
            const recommendation = new SeriesRecommendation(serie);
            recommendation.inWatchlist = await this.watchlistService
                .isInWatchlist(userId, recommendation.id.toString(), contentTypes.SERIES);
            return recommendation;
        });
    }

    private async getStreamClubSeries(seriesId: number, country: string): Promise<Series> {
        return await this.getContentSafely(async () => {
            const serie = await this.tmdb.tvInfo({
                id: seriesId, language: this.language,
                append_to_response: 'credits,watch/providers,recommendations'
            }) as TmdbSeries;
            return new Series(serie, country);
        })
    }

    public async getSeries(userId: number, seriesId: number, country: string): Promise<Series> {
        const scSeries = await this.getStreamClubSeries(seriesId, country);
        const providersData = await this.getContentProviders(this.tmdbContentTypes.SERIES, seriesId, country);
        const userPlatforms = await this.streamProviderService.getAll(userId);
        scSeries.setProviders(providersData, userPlatforms.providerId);
        const nextEpisode = await this.getNextEpisode(userId, scSeries.id, scSeries.seasons);
        scSeries.nextEpisode = nextEpisode;
        const totalWatchedEpisodes = await this.seenContentService
            .getTotalWatchedEpisodes(userId, scSeries.id)
        scSeries.setSeen(scSeries.numberOfEpisodes, totalWatchedEpisodes)
        scSeries.inWatchlist = await this.watchlistService
            .isInWatchlist(userId, seriesId.toString(), contentTypes.SERIES);
        scSeries.userReview = await this.reviewService.getReview(userId, seriesId, contentTypes.SERIES);
        return scSeries;
    }

    public async getSeriesBasicInfo(seriesId: number) {
        return await this.getContentSafely(async () => {
            const serie = await this.tmdb.tvInfo({ id: seriesId, language: this.language });
            return new SeriesBasicInfo(serie);
        });
    }

    public async getEpisode(serieId: number, seasonId: number, episodeNumber: number) {
        const season = await this.getSeason(serieId, seasonId);
        const episode = season.episodes.find(episode => episode.episodeId === episodeNumber);
        if (!episode) {
            throw new NotFoundException('El episodio no existe');
        }
        return episode;
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

    private async getNextEpisode(userId: number, serieId: number, seasons: TvSeasonResponse[]): Promise<LastSeenEpisode> {
        const lastSeenEpisode: SeenEpisode = await this.seenContentService
            .getLastSeenEpisode(userId, serieId);
        if (!lastSeenEpisode) {
            return this.getSeasonFirstEpisode(serieId, 1, seasons);
        } else {
            const season = await this.getSeason(serieId, lastSeenEpisode.seasonId);
            const nextEpisode = season.episodes.find(episode => episode.episodeId === lastSeenEpisode.episodeId + 1);
            if (nextEpisode) {
                return new LastSeenEpisode(nextEpisode, season.id);
            } else {
                return await this.getSeasonFirstEpisode(serieId, lastSeenEpisode.seasonId + 1, seasons);
            }
        }
    }

    private async getSeasonFirstEpisode(serieId: number, seasonId: number, showSeasons: TvSeasonResponse[]) {
        const filtered = showSeasons.filter(season => season.season_number === seasonId || season.id === seasonId);
        if (filtered.length > 0) {
            const season = await this.getSeason(serieId, seasonId);
            return new LastSeenEpisode(season.episodes[0], season.id);
        } else {
            return null;
        }
    }

    public async getSeason(serieId: number, seasonId: number): Promise<Season> {
        return await this.getContentSafely(async () => {
            const season = await this.tmdb.seasonInfo({ id: serieId, season_number: seasonId, language: this.language });
            return new Season(season);
        });
    }

    public async getUserSeason(userId: number, serieId: number, seasonId: number) {
        const season = await this.getSeason(serieId, seasonId);
        const seenEpisodes = await this.seenContentService
            .getSeenEpisodes(userId, serieId, seasonId);
        season.setSeenEpisodes(seenEpisodes);
        return season;
    }

    public async searchMovie(userId: number, query: string, page: number, country: string) {
        const result = await this.tmdb.searchMovie({ query, language: this.language, page });
        const movies = await Promise.all(result.results.map(async (movie: MovieResult) => {
            const movieResume = new MovieResume(movie)
            movieResume.inWatchlist = await this.watchlistService
                .isInWatchlist(userId, movie.id.toString(), contentTypes.MOVIE);
            movieResume.seen = await this.seenContentService
                .isASeenMovie(userId, movie.id);
            const scMovie = await this.getStreamClubMovie(movie.id, country);
            movieResume.status = scMovie.status;
            const providersIds = scMovie.platforms.map(platform => platform.providerId);
            movieResume.available = await this.streamProviderService.doesUserHaveOneOf(userId, providersIds)
            return movieResume;
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, movies);
    }

    public async discoverMovies(userId: number, page: number, country: string, genderIds: string[],
        runtimeGte: number, runtimeLte: number, inMyPlatforms: boolean
    ) {
        const platforms = inMyPlatforms ? (await this.streamProviderService.getAll(userId)).providerId : [];
        const result = await this.tmdb.discoverMovie({
            language: this.language, page, watch_region: country, with_watch_providers: platforms.join('|'),
            with_genres: genderIds.join(','), "with_runtime.gte": runtimeGte, "with_runtime.lte": runtimeLte
        });
        const movies = await Promise.all(result.results.map(async (movie: MovieResult) => {
            const movieResume = new MovieResume(movie)
            movieResume.inWatchlist = await this.watchlistService
                .isInWatchlist(userId, movie.id.toString(), contentTypes.MOVIE);
            movieResume.seen = await this.seenContentService
                .isASeenMovie(userId, movie.id);
            const scMovie = await this.getStreamClubMovie(movie.id, country);
            movieResume.status = scMovie.status;
            const providersIds = scMovie.platforms.map(platform => platform.providerId);
            movieResume.available = await this.streamProviderService.doesUserHaveOneOf(userId, providersIds)
            return movieResume;
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, movies);
    }

    public async searchSeries(userId: number, query: string, page: number, country: string) {
        const result = await this.tmdb.searchTv({ query, language: this.language, page });
        const series = await Promise.all(result.results.map(async (serie: TvResult) => {
            const serieResume = new SeriesResume(serie)
            serieResume.inWatchlist = await this.watchlistService
                .isInWatchlist(userId, serie.id.toString(), contentTypes.SERIES);
            const totalWatchedEpisodes = await this.seenContentService
                .getTotalWatchedEpisodes(userId, serie.id)
            const scSeries = await this.getStreamClubSeries(serie.id, country);
            serieResume.setSeen(scSeries.numberOfEpisodes, totalWatchedEpisodes)
            serieResume.status = scSeries.status;
            serieResume.lastEpisodeReleaseDate = scSeries.lastAirDate;
            const providersIds = scSeries.platforms.map(platform => platform.providerId);
            serieResume.available = await this.streamProviderService.doesUserHaveOneOf(userId, providersIds)
            return serieResume;
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, series);
    }

    public async discoverSeries(userId: number, page: number
        , country: string, genderIds: string[], runtimeGte: number, runtimeLte: number, inMyPlatforms: boolean
    ) {
        const platforms = inMyPlatforms ? (await this.streamProviderService.getAll(userId)).providerId : [];
        const result = await this.tmdb.discoverTv({
            language: this.language, page, watch_region: country, with_watch_providers: platforms.join('|'),
            with_genres: genderIds.join(','), "with_runtime.gte": runtimeGte, "with_runtime.lte": runtimeLte
        });
        const series = await Promise.all(result.results.map(async (serie: TvResult) => {
            const serieResume = new SeriesResume(serie)
            serieResume.inWatchlist = await this.watchlistService
                .isInWatchlist(userId, serie.id.toString(), contentTypes.SERIES);
            const totalWatchedEpisodes = await this.seenContentService
                .getTotalWatchedEpisodes(userId, serie.id)
            const scSeries = await this.getStreamClubSeries(serie.id, country);
            serieResume.setSeen(scSeries.numberOfEpisodes, totalWatchedEpisodes)
            serieResume.status = scSeries.status;
            serieResume.lastEpisodeReleaseDate = scSeries.lastAirDate;
            const providersIds = scSeries.platforms.map(platform => platform.providerId);
            serieResume.available = await this.streamProviderService.doesUserHaveOneOf(userId, providersIds)
            return serieResume;
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, series);
    }

    public async searchArtist(userId: number, query: string, page: number) {
        const result = await this.tmdb.searchPerson({ query, language: this.language, page });
        const artists = await Promise.all(result.results.map(async (artist) => {
            const artistDetail = await this.tmdb.personInfo({ id: artist.id, language: this.language });
            return new ArtistResume(artistDetail);
        }));
        return new PaginatedResult(result.page, result.total_pages, result.total_results, artists);
    }

    public async getNameAndPoster(contentType: string, contentId: number) {
        const tmdbContent = contentType == this.tmdbContentTypes.MOVIE ?
            await this.tmdb.movieInfo({ id: contentId, language: this.language }) :
            await this.tmdb.tvInfo({ id: contentId, language: this.language });
        const title = this.getTmdbContentName(tmdbContent, contentType);
        return {
            poster: tmdbContent.poster_path,
            title
        };
    }

    private getTmdbContentName(tmdbContent: MovieResponse | ShowResponse, contentType: string) {
        const defaultName = ""
        if (!tmdbContent) {
            return defaultName;
        }
        if (contentType == contentTypes.MOVIE) {
            return (tmdbContent as TmdbMovie).title;
        } else if (contentType == contentTypes.SERIES) {
            return (tmdbContent as TmdbSeries).name;
        }
        return defaultName;
    }

    public async getStreamProviders(country: string) {
        const streamServices = await this.tmdb.movieWatchProviderList({
            language: this.language,
            watch_region: country
        });
        return await Promise.all(streamServices.results.map(async (result) => {
            return new Platform(result);
        }));
    }

    public async getTriviaContent(contentId: number, contentType: string) {
        return await this.getContentSafely(async () => {
            const tmdbContent = contentType == contentTypes.MOVIE ?
                await this.tmdb.movieInfo({ id: contentId, language: this.language }) :
                await this.tmdb.tvInfo({ id: contentId, language: this.language });
            return {
                title: this.getTmdbContentName(tmdbContent, contentType),
                poster: tmdbContent.poster_path
            };
        });
    }

    private async getContentProviders(contentType: string, contentId: number, country: string) {
        const providersUrl = `https://www.themoviedb.org/${contentType}/${contentId}/watch?locale=${country}`;
        return await getRedirectLinks(providersUrl);
    }

    public async getResumeSafely(contentId: number, callback: Function) {
        try {
            return await this.getContentSafely(callback);
        } catch (error) {
            if (error?.code === 404) {
                logger.warn('El contenido no existe. Id: ' + contentId);
                return null;
            }
            throw error;
        }
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
