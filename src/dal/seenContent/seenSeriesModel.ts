import { SeenSeries } from '@entities'
import { Document, Schema } from 'mongoose'
import { SeenSeasonSchema } from './seenSeasonModel'

type SeenSeriesType = SeenSeries & Document

export const SeenSeriesSchema = new Schema<SeenSeriesType>({
    seriesId: {
        type: Number,
        required: true,
    },
    seasons: {
        type: [SeenSeasonSchema],
        default: [],
    },
    totalWatchedEpisodes: {
        type: Number,
        default: 0,
    },
    nextEpisode: {
        episodeNumber: Number,
        seasonId: Number,
    },
}, { _id: false })
