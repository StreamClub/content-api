import { MongoObject } from "@dtos";
import { SeenContent } from "./seenContent";

export class SeenContentResume extends MongoObject {
    userId: number;
    movies: number[];
    series: number[];

    constructor(seenContent: SeenContent) {
        super(seenContent);
        this.userId = seenContent.userId;
        this.movies = seenContent.movies.map((movie) => movie.movieId);
        this.series = seenContent.series.map((series) => series.seriesId);
    }
}