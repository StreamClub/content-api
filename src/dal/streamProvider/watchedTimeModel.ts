import { WatchedTime } from '@entities'
import { Document, Schema } from 'mongoose'

type WatchedTimeType = WatchedTime & Document

export const WatchedTimeTypeSchema = new Schema<WatchedTimeType>({
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    timeWatched: {
        type: Number,
        required: true,
    },
}, { _id: false })
