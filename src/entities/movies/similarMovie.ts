import { MovieResponse } from "moviedb-promise";

export class SimilarMovie {
    id: number;
    title: string;
    posterPath: string;
    releaseDate: string;

    constructor(movie: MovieResponse) {
        this.id = movie.id;
        this.title = movie.title;
        this.posterPath = movie.poster_path;
        this.releaseDate = movie.release_date;
    }
}
