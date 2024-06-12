import { Privacy } from '@entities'
import { Document, model, Schema } from 'mongoose'

type PrivacyType = Privacy & Document

const WatchlistSchema = new Schema<PrivacyType>({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    isWatchlistPrivate: {
        type: Boolean,
        default: false,
    },
    isSeenContentListPrivate: {
        type: Boolean,
        default: false,
    },
})
WatchlistSchema.index({ userId: 1 }, { unique: true })

export const PrivacyModel = model<PrivacyType>('Privacy', WatchlistSchema)
