import { WatchlistItem } from "./watchlistItem";

export class WatchlistItemResume extends WatchlistItem {
    poster: string;

    constructor(watchlistItem: WatchlistItem, poster: string) {
        super(watchlistItem);
        this.poster = poster;
    }
}