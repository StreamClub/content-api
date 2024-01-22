

export class WatchlistItem {
    id: number;
    createdAt: Date;
    contentType: string;

    constructor(watchlistItem: WatchlistItem) {
        this.id = watchlistItem.id;
        this.createdAt = watchlistItem.createdAt;
        this.contentType = watchlistItem.contentType;
    }
}
