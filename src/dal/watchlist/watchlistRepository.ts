import { Page, Watchlist, WatchlistItem } from '@entities'
import { WatchlistModel } from './watchlistModel'

class WatchlistRepository {
    async create(userId: number): Promise<Watchlist> {
        const watchlist = new WatchlistModel({ userId });
        await watchlist.save();
        return new Watchlist(watchlist);
    }

    async get(userId: number, page: number, pageSize: number): Promise<Page> {
        const founded = await WatchlistModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $project: {
                    _id: 0,
                    watchlist: 1,
                },
            },
            {
                $unwind: {
                    'path': '$watchlist'
                }
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize }
        ]);
        const watchlistLength = await this.getWatchlistSize(userId);
        const watchlist = founded.map((content) => {
            return new WatchlistItem(content.watchlist)
        });
        return new Page(page, pageSize, watchlistLength, watchlist);
    }

    async getWatchlistSize(userId: number): Promise<number> {
        const size = await WatchlistModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $project: {
                    watchlistLength: { $size: "$watchlist" },
                },
            },
        ]);
        return size[0] ? size[0].watchlistLength : 0;
    }

    async doesUserHaveWatchlist(userId: number): Promise<boolean> {
        const watchlistCount = await WatchlistModel.countDocuments({ userId });
        return watchlistCount > 0;
    }

    async addContent(userId: number, contentId: string, contentType: string): Promise<void> {
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

    async removeContent(userId: number, contentId: string, contentType: string): Promise<void> {
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

    async isInWatchlist(userId: number, contentId: string, contentType: string): Promise<boolean> {
        const watchlist = await WatchlistModel.findOne({
            userId,
            'watchlist': {
                $elemMatch: {
                    id: contentId,
                    contentType
                }
            }
        });
        return watchlist !== null;
    }
}

export const watchlistRepository = new WatchlistRepository();
