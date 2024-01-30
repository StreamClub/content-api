import { MongoObject } from "@dtos";
import { WatchlistItem } from "./watchlistItem";

export class Watchlist extends MongoObject {
    userId: number;
    watchlist: WatchlistItem[];
    series: WatchlistItem[];

    constructor(watchlist: Watchlist) {
        super(watchlist);
        this.userId = watchlist.userId;
        this.watchlist = watchlist.watchlist.map((content) => new WatchlistItem(content));
    }
}
