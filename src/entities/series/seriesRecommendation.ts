import { ShowResponse } from "moviedb-promise";

export class SeriesRecommendation {
    public id: number;
    public title: string;
    public poster: string;
    public releaseDate: string;
    public score: number;
    public genres: string[];
    public genresIds: string[];
    public duration: number;
    public inWatchlist: boolean;

    constructor(series: ShowResponse) {
        this.id = series.id;
        this.title = series.name;
        this.poster = series.poster_path;
        this.releaseDate = series.first_air_date;
        this.score = series.vote_average;
        this.genres = series.genres.map((genre) => genre.name);
        this.genresIds = series.genres.map((genre) => genre.id.toString());
        this.duration = series.number_of_seasons;
    }
}
