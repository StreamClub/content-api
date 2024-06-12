import { MongoObject } from "@dtos";

export class Privacy extends MongoObject {
    userId: number;
    isWatchlistPrivate: boolean;
    isSeenContentListPrivate: boolean;

    constructor(watchlist: Privacy) {
        super(watchlist);
        this.userId = watchlist.userId;
        this.isWatchlistPrivate = watchlist.isWatchlistPrivate;
        this.isSeenContentListPrivate = watchlist.isSeenContentListPrivate;
    }
}
