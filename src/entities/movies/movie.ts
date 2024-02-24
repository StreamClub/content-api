import { TmdbMovie } from "./tmdbMovie";
import { SimilarMovie } from "./similarMovie";
import { Content } from "../content";

export class Movie extends Content {
    releaseDate: string;
    runtime: number;
    budget: number;
    revenue: number;
    status: string;
    directors: string[];
    similar: SimilarMovie[];
    seen: boolean;
    inWatchlist: boolean;

    constructor(tmdbMovie: TmdbMovie, country: string) {
        super(tmdbMovie, country);
        this.title = tmdbMovie.title;
        this.releaseDate = tmdbMovie.release_date;
        this.runtime = tmdbMovie.runtime;
        this.budget = tmdbMovie.budget;
        this.revenue = tmdbMovie.revenue;
        this.status = tmdbMovie.status;
        this.directors = tmdbMovie.credits.crew.filter((crew) => crew.job === 'Director').map((crew) => crew.name);
        this.similar = tmdbMovie.recommendations.results.slice(0, 10).map((movie) => new SimilarMovie(movie));
    }
}
