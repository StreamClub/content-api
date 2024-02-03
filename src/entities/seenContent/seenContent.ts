import { MongoObject } from "@dtos";
import { SeenMovie, SeenSeries } from "@entities";

export class SeenContent extends MongoObject {
    userId: number;
    movies: SeenMovie[];
    series: SeenSeries[];

    constructor(seenContent: SeenContent) {
        super(seenContent);
        this.userId = seenContent.userId;
        this.movies = seenContent.movies;
        this.series = seenContent.series;
    }
}
