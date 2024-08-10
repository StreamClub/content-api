import { OtherStreamProviders } from '@entities'
import { Document, model, Schema } from 'mongoose'
import { WatchedTimeTypeSchema } from '../watchedTimeModel'

type OtherStreamProvidersType = OtherStreamProviders & Document

export const OtherStreamProvidersTypeSchema = new Schema<OtherStreamProvidersType>({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    watchedTime: {
        type: [WatchedTimeTypeSchema],
        default: [],
    }
})
OtherStreamProvidersTypeSchema.index({ userId: 1 }, { unique: true })

export const OtherStreamProvidersModel = model<OtherStreamProvidersType>('OtherStreamProvider',
    OtherStreamProvidersTypeSchema)
