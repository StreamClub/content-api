import { SeenItem } from "./seenItem";

export class SeenMovieItem extends SeenItem {
    public movieId: number;
    public updatedAt: Date;

    public constructor(movie: SeenMovieItem) {
        super("movie", movie.updatedAt);
        this.movieId = movie.movieId;
        this.updatedAt = movie.updatedAt;
    }
}
