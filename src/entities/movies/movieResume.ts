import { MovieResult } from "moviedb-promise";

export class MovieResume {
    id: number;
    title: string;
    poster: string;
    available: boolean;
    releaseDate: string;
    score: number;
    seen: boolean;
    inWatchlist: boolean;

    constructor(movie: MovieResult) {
        this.id = movie.id;
        this.title = movie.title;
        this.poster = movie.poster_path;
        this.releaseDate = movie.release_date;
        this.score = movie.vote_average; //TODO: cambiar el score por el de la base de datos
    }
}
