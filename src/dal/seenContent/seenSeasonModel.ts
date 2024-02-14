import { SeenSeason } from '@entities'
import { Document, Schema } from 'mongoose'
import { SeenEpisodeSchema } from './seenEpisodeModel'

type SeenSeasonType = SeenSeason & Document

export const SeenSeasonSchema = new Schema<SeenSeasonType>({
    seasonId: {
        type: Number,
        required: true,
    },
    episodes: {
        type: [SeenEpisodeSchema],
        default: [],
    },
}, { _id: false })
