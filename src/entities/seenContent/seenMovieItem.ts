import { SeenItem } from "./seenItem";

export class SeenMovieItem extends SeenItem {

    public constructor(movie: SeenMovieItem) {
        super(movie.id, "movie", movie.updatedAt);
    }
}
