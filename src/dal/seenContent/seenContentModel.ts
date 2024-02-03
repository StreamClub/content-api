import { SeenContent } from '@entities'
import { Document, model, Schema } from 'mongoose'

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
        type: [{
            seriesId: Number,
            seasons: [{
                seasonNumber: Number,
                episodes: [{
                    episodeNumber: Number,
                }],
            }],
            totalWatchedEpisodes: Number,
            nextEpisode: {
                episodeNumber: Number,
                seasonNumber: Number,
            },
        }],
        default: [],
    },
})
SeenContentSchema.index({ userId: 1 })

export const SeenContentModel = model<SeenContentType>('SeenContent', SeenContentSchema)
