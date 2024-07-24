import { StreamProviders } from '@entities'
import { Document, model, Schema } from 'mongoose'
import { StreamProviderTypeSchema } from './streamProviderModel'

type StreamProvidersType = StreamProviders & Document

const StreamProvidersTypeSchema = new Schema<StreamProvidersType>({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    streamProviders: {
        type: [StreamProviderTypeSchema],
        default: [],
    }
})
StreamProvidersTypeSchema.index({ userId: 1 }, { unique: true })

export const StreamProvidersModel = model<StreamProvidersType>('StreamProvider', StreamProvidersTypeSchema)
