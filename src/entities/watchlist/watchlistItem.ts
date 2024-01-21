

export class WatchlistItem {
    id: string;
    createdAt: Date;

    constructor(watchlistItem: WatchlistItem) {
        this.id = watchlistItem.id;
        this.createdAt = watchlistItem.createdAt;
    }
}
