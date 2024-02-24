import { UserStreamProviders } from '@entities'
import { Document, model, Schema } from 'mongoose'

type StreamProvidersType = UserStreamProviders & Document

const StreamProvidersTypeSchema = new Schema<StreamProvidersType>({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    providerId: {
        type: [Number],
        default: [],
    }
})
StreamProvidersTypeSchema.index({ userId: 1 })

export const StreamProvidersModel = model<StreamProvidersType>('StreamProvider', StreamProvidersTypeSchema)
