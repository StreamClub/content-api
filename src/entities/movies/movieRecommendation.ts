import { MovieResponse } from "moviedb-promise";

export class MovieRecommendation {
    public id: number;
    public title: string;
    public poster: string;
    public releaseDate: string;
    public score: number;
    public genres: string[];
    public genresIds: string[];
    public duration: number;
    public inWatchlist: boolean;

    constructor(movie: MovieResponse) {
        this.id = movie.id;
        this.title = movie.title;
        this.poster = movie.poster_path;
        this.releaseDate = movie.release_date;
        this.score = movie.vote_average;
        this.genres = movie.genres.map((genre) => genre.name);
        this.genresIds = movie.genres.map((genre) => genre.id.toString());
        this.duration = movie.runtime;
    }
}
