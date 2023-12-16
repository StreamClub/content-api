import { MovieResponse } from "moviedb-promise";

export class SimilarMovie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    constructor(movie: MovieResponse) {
        this.id = movie.id;
        this.title = movie.title;
        this.poster_path = movie.poster_path;
        this.release_date = movie.release_date;
    }
}
