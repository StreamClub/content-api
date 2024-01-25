import { Cast, Video } from "moviedb-promise";
import { TmdbMovie } from "./tmdbMovie";
import { SimilarMovie } from "./similarMovie";
import { Platform, ProvidersDictionary } from "@entities";

export class Movie {
    id: number;
    title: string;
    overview: string;
    poster: string;
    backdrop: string;
    genres: string[];
    releaseDate: string;
    runtime: number;
    budget: number;
    revenue: number;
    status: string;
    platforms: Platform[];
    directors: string[];
    cast: Cast[];
    similar: SimilarMovie[];
    trailers: Video[];


    constructor(tmdbMovie: TmdbMovie, country: string, provider: ProvidersDictionary) {
        this.id = tmdbMovie.id;
        this.title = tmdbMovie.title;
        this.overview = tmdbMovie.overview;
        this.poster = tmdbMovie.poster_path;
        this.backdrop = tmdbMovie.backdrop_path;
        this.genres = tmdbMovie.genres.map((genre) => genre.name);
        this.releaseDate = tmdbMovie.release_date;
        this.runtime = tmdbMovie.runtime;
        this.budget = tmdbMovie.budget;
        this.revenue = tmdbMovie.revenue;
        this.status = tmdbMovie.status;
        this.getPlatforms(tmdbMovie, country, provider);
        this.directors = tmdbMovie.credits.crew.filter((crew) => crew.job === 'Director').map((crew) => crew.name);
        this.cast = tmdbMovie.credits.cast.slice(0, 10);
        this.similar = tmdbMovie.recommendations.results.slice(0, 10).map((movie) => new SimilarMovie(movie));
        this.trailers = this.getTrailers(tmdbMovie);
    }

    private getPlatforms(tmdbMovie: TmdbMovie, country: string, provider: ProvidersDictionary) {
        const countryPlatforms = Object.entries(tmdbMovie["watch/providers"].results).filter(([key, _]) => {
            return key === country;
        });
        const platforms = [];
        if (countryPlatforms.length > 0 && countryPlatforms[0][1].flatrate) {
            for (const platform of countryPlatforms[0][1].flatrate) {
                platforms.push(new Platform(platform));
            }
        }
        this.platforms = platforms;
        this.setProvidersData(provider)
    }

    private getTrailers(tmdbMovie: TmdbMovie) {
        const youtubeTrailers = tmdbMovie.videos.results.filter((video) => video.site === 'YouTube' && video.type === 'Trailer');
        return youtubeTrailers.length > 0 ? youtubeTrailers : null;
    }

    private setProvidersData(provider: ProvidersDictionary) {
        for (const platform of this.platforms) {
            const logoPath = platform.logoPath;
            const matchingKey = Object.keys(provider).find(key => key.endsWith(logoPath));
            if (matchingKey) {
                platform.link = provider[matchingKey].link;
            }
        }
    }
}
