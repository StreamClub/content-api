import { SeenContent } from '@entities'
import { Document, model, Schema } from 'mongoose'
import { SeenSeriesSchema } from './seenSeriesModel'
import { SeenMovieSchema } from './seenMovieModel'

type SeenContentType = SeenContent & Document

const SeenContentSchema = new Schema<SeenContentType>({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    movies: {
        type: [SeenMovieSchema],
        default: [],
    },
    series: {
        type: [SeenSeriesSchema],
        default: [],
    },
})
SeenContentSchema.index({ userId: 1 }, { unique: true })

export const SeenContentModel = model<SeenContentType>('SeenContent', SeenContentSchema)
