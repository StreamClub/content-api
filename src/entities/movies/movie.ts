import { Cast, WatchProvider } from "moviedb-promise";
import { TmdbMovie } from "./tmdbMovie";

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
    platforms: Array<WatchProvider>;
    director: string[];
    cast: Array<Cast>;


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
        this.director = tmdbMovie.credits.crew.filter((crew) => crew.job === 'Director').map((crew) => crew.name);
        this.cast = tmdbMovie.credits.cast.slice(0, 10);
    }

    private getPlatforms(tmdbMovie: TmdbMovie, country: string) {
        console.log(tmdbMovie["watch/providers"])
        const countryPlatforms = Object.entries(tmdbMovie["watch/providers"].results).filter(([key, _]) => {
            return key === country;
        });
        return countryPlatforms.length > 0 && countryPlatforms[0][1].flatrate ? countryPlatforms[0][1].flatrate : null;
    }
}
