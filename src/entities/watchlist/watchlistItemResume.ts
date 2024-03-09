import { WatchlistItem } from "./watchlistItem";

export class WatchlistItemResume extends WatchlistItem {
    poster: string;
    title: string;

    constructor(watchlistItem: WatchlistItem, poster: string, title: string) {
        super(watchlistItem);
        this.poster = poster;
        this.title = title;
    }
}