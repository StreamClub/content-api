import { ShowResponse } from "moviedb-promise";

export class SimilarSeries {
    id: number;
    title: string;
    posterPath: string;
    releaseDate: string;

    constructor(series: ShowResponse) {
        this.id = series.id;
        this.title = series.name;
        this.posterPath = series.poster_path;
        this.releaseDate = series.first_air_date;
    }
}
