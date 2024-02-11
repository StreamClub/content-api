import { SeenMovie } from '@entities'
import { Document, Schema } from 'mongoose'

type SeenMovieType = SeenMovie & Document

export const SeenMovieSchema = new Schema<SeenMovieType>({
    movieId: {
        type: Number,
        required: true,
    },
}, { _id: false, timestamps: true })
