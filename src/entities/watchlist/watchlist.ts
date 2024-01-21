import { MongoObject } from "../../dtos/mongoObject";

export class Watchlist extends MongoObject {
    userId: string;
    movies: string[];
    series: string[];

    constructor(watchlist: Watchlist) {
        super(watchlist);
        this.userId = watchlist.userId;
        this.movies = watchlist.movies;
        this.series = watchlist.series;
    }
}
