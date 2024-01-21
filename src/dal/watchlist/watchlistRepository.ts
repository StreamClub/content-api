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

    async addMovie(userId: string, movieId: string): Promise<void> {
        await WatchlistModel.updateOne(
            {
                userId,
                'movies.id': { $ne: movieId }
            },
            {
                $push: {
                    movies: {
                        $each: [{ id: movieId, createdAt: new Date() }],
                        $position: 0
                    }
                }
            },
            { upsert: true }
        );
        return;
    }
}
