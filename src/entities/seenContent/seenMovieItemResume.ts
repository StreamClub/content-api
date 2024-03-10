import { SeenMovieItem } from "./seenMovieItem";

export class SeenMovieItemResume extends SeenMovieItem {

    public poster: string;
    public title: string;

    public constructor(movie: SeenMovieItem, poster: string, title: string) {
        super(movie);
        this.poster = poster;
        this.title = title;
    }
}
