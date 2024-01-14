import { MovieResult } from "moviedb-promise";
import { randomInt } from "node:crypto";


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
        this.available = Math.round(Math.random() * 1) == 1; //TODO: cambiar el available segun los servicios del usuario
        this.releaseDate = movie.release_date;
        this.score = movie.vote_average; //TODO: cambiar el score por el de la base de datos
        this.seen = Math.round(Math.random() * 1) == 1;; //TODO: cambiar el seen por el de la base de datos
        this.inWatchlist = Math.round(Math.random() * 1) == 1; //TODO: cambiar el inWatchlist por el de la base de datos
    }
}
