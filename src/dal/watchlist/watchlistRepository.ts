import { Watchlist } from '@dtos'
import { WatchlistModel } from './watchlistModel'

export default class WatchlistRepository {
    async create(userId: string): Promise<Watchlist> {
        const watchlist = new WatchlistModel({ userId })
        await watchlist.save()
        return new Watchlist(watchlist)
    }

    async get(userId: string): Promise<Watchlist> {
        const watchlist = await WatchlistModel.findOne({ userId })
        return new Watchlist(watchlist)
    }
}
