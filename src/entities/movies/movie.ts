import { Cast, Video, WatchProvider } from "moviedb-promise";
import { TmdbMovie } from "./tmdbMovie";
import { SimilarMovie } from "./similarMovie";

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
    platforms: WatchProvider[];
    directors: string[];
    cast: Cast[];
    similar: SimilarMovie[];
    trailers: Video[];


    constructor(tmdbMovie: TmdbMovie, country: string) {
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
        this.platforms = this.getPlatforms(tmdbMovie, country);
        this.directors = tmdbMovie.credits.crew.filter((crew) => crew.job === 'Director').map((crew) => crew.name);
        this.cast = tmdbMovie.credits.cast.slice(0, 10);
        this.similar = tmdbMovie.recommendations.results.slice(0, 10).map((movie) => new SimilarMovie(movie));
        this.trailers = this.getTrailers(tmdbMovie);
    }

    private getPlatforms(tmdbMovie: TmdbMovie, country: string) {
        const countryPlatforms = Object.entries(tmdbMovie["watch/providers"].results).filter(([key, _]) => {
            return key === country;
        });
        return countryPlatforms.length > 0 && countryPlatforms[0][1].flatrate ? countryPlatforms[0][1].flatrate : null;
    }

    private getTrailers(tmdbMovie: TmdbMovie) {
        const youtubeTrailers = tmdbMovie.videos.results.filter((video) => video.site === 'YouTube' && video.type === 'Trailer');
        return youtubeTrailers.length > 0 ? youtubeTrailers : null;
    }
}
