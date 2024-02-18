import { ShowResponse } from "moviedb-promise";

export class SimilarSeries {
    public id: number;
    public title: string;
    public posterPath: string;
    public releaseDate: string;

    constructor(series: ShowResponse) {
        this.id = series.id;
        this.title = series.name;
        this.posterPath = series.poster_path;
        this.releaseDate = series.first_air_date;
    }
}
