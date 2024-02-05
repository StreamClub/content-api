import { MongoObject } from "@dtos";

export class SeenMovie extends MongoObject {
    public movieId: number;

    public constructor(movie: SeenMovie) {
        super(movie);
        this.movieId = movie.movieId
    }
}
