import { Watchlist, WatchlistItem } from '@entities'
import { Document, model, Schema } from 'mongoose'

type WatchlistType = Watchlist & Document

const WatchlistSchema = new Schema<WatchlistType>({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    movies: {
        type: [{
            id: String,
            createdAt: Date,
        }],
        default: [],
    },
    series: {
        type: [{
            id: String,
            createdAt: Date,
        }],
        default: [],
    },
})
WatchlistSchema.index({ userId: 1 })

export const WatchlistModel = model<WatchlistType>('Watchlist', WatchlistSchema)
