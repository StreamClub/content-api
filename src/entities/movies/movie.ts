import { TmdbMovie } from "./tmdbMovie";
import { SimilarMovie } from "./similarMovie";
import { Content } from "../content";
import { movieStatus } from "@config";

export class Movie extends Content {
    public releaseDate: string;
    public runtime: number;
    public status: string;
    public directors: string[];
    public similar: SimilarMovie[];
    public seen: boolean;
    public inWatchlist: boolean;

    constructor(tmdbMovie: TmdbMovie, country: string) {
        super(tmdbMovie, country);
        this.title = tmdbMovie.title;
        this.releaseDate = tmdbMovie.release_date;
        this.runtime = tmdbMovie.runtime;
        this.status = movieStatus[tmdbMovie.status];
        this.directors = tmdbMovie.credits.crew.filter((crew) => crew.job === 'Director').map((crew) => crew.name);
        this.similar = tmdbMovie.recommendations.results.slice(0, 10).map((movie) => new SimilarMovie(movie));
    }
}
