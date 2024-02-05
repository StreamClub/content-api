import { SeenEpisode } from '@entities'
import { Document, Schema } from 'mongoose'

type SeenEpisodeType = SeenEpisode & Document

export const SeenEpisodeSchema = new Schema<SeenEpisodeType>({
    episodeId: {
        type: Number,
        required: true,
    },
}, { _id: false })
