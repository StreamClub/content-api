import { StreamProvider } from '@entities'
import { Document, Schema } from 'mongoose'
import { WatchedTimeTypeSchema } from './watchedTimeModel'

type StreamProviderType = StreamProvider & Document

export const StreamProviderTypeSchema = new Schema<StreamProviderType>({
    providerId: {
        type: Number,
        required: true,
    },
    watchedTime: {
        type: [WatchedTimeTypeSchema],
        default: [],
    }
}, { _id: false })
