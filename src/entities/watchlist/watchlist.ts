import { MongoObject } from "../../dtos/mongoObject";
import { WatchlistItem } from "./watchlistItem";

export class Watchlist extends MongoObject {
    userId: number;
    movies: WatchlistItem[];
    series: WatchlistItem[];

    constructor(watchlist: Watchlist) {
        super(watchlist);
        this.userId = watchlist.userId;
        this.movies = watchlist.movies.map((movie) => new WatchlistItem(movie));
        this.series = watchlist.series.map((series) => new WatchlistItem(series));
    }
}
