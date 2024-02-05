import { MongoObject } from "@dtos";
import { SeenMovie, SeenSeries } from "@entities";

export class SeenContent extends MongoObject {
    userId: number;
    movies: SeenMovie[];
    series: SeenSeries[];

    constructor(seenContent: SeenContent) {
        super(seenContent);
        this.userId = seenContent.userId;
        this.movies = seenContent.movies.map((movie) => new SeenMovie(movie));
        this.series = seenContent.series.map((series) => new SeenSeries(series));
    }
}
