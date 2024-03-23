import { Watchlist } from '@entities'
import { Document, model, Schema } from 'mongoose'

type WatchlistType = Watchlist & Document

const WatchlistSchema = new Schema<WatchlistType>({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    watchlist: {
        type: [{
            id: Number,
            createdAt: Date,
            contentType: String,
        }],
        default: [],
    }
})
WatchlistSchema.index({ userId: 1 }, { unique: true })

export const WatchlistModel = model<WatchlistType>('Watchlist', WatchlistSchema)
