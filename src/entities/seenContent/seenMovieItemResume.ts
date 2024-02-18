import { SeenMovieItem } from "./seenMovieItem";

export class SeenMovieItemResume extends SeenMovieItem {

    public poster: string;

    public constructor(movie: SeenMovieItem, poster: string) {
        super(movie);
        this.poster = poster;
    }
}
