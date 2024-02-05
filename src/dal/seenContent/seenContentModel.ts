import { SeenContent } from '@entities'
import { Document, model, Schema } from 'mongoose'
import { SeenSeriesSchema } from './seenSeriesModel'

type SeenContentType = SeenContent & Document

const SeenContentSchema = new Schema<SeenContentType>({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    movies: {
        type: [{
            movieId: Number,
        }],
        default: [],
    },
    series: {
        type: [SeenSeriesSchema],
        default: [],
    },
})
SeenContentSchema.index({ userId: 1 })

export const SeenContentModel = model<SeenContentType>('SeenContent', SeenContentSchema)
