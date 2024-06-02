import { MovieResponse, MovieResult } from "moviedb-promise";

export class MovieResume {
    public id: number;
    public title: string;
    public poster: string;
    public available: boolean;
    public releaseDate: string;
    public status: string;
    public score: number;
    public seen: boolean;
    public inWatchlist: boolean;

    constructor(movie: MovieResult | MovieResponse) {
        this.id = movie.id;
        this.title = movie.title;
        this.poster = movie.poster_path;
        this.releaseDate = movie.release_date;
        this.score = movie.vote_average; //TODO: cambiar el score por el de la base de datos
    }
}
