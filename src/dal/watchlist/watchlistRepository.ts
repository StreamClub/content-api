import { Watchlist } from '@entities'
import { WatchlistModel } from './watchlistModel'

export default class WatchlistRepository {
    async create(userId: string): Promise<Watchlist> {
        const watchlist = new WatchlistModel({ userId });
        await watchlist.save();
        return new Watchlist(watchlist);
    }

    async get(userId: string): Promise<Watchlist> {
        return await WatchlistModel.findOne({ userId });
    }

    async addContent(userId: string, contentId: string, contentType: string): Promise<void> {
        await WatchlistModel.updateOne(
            {
                userId,
                'watchlist': {
                    $not: {
                        $elemMatch: {
                            id: contentId,
                            contentType
                        }
                    }
                }
            },
            {
                $push: {
                    watchlist: {
                        $each: [{ id: contentId, createdAt: new Date(), contentType }],
                        $position: 0
                    }
                }
            },
        );
    }

    async removeContent(userId: string, contentId: string, contentType: string): Promise<void> {
        await WatchlistModel.updateOne(
            {
                userId,
                'watchlist': {
                    $elemMatch: {
                        id: contentId,
                        contentType
                    }
                }
            },
            {
                $pull: {
                    watchlist: {
                        id: contentId,
                        contentType
                    }
                }
            },
        );
    }
}
