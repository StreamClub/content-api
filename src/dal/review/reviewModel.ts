import { Review } from '@entities'
import { Document, model, Schema } from 'mongoose'

type ReviewType = Review & Document

const ReviewSchema = new Schema<ReviewType>({
    userId: {
        type: Number,
        required: true,
    },
    contentId: {
        type: Number,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    liked: {
        type: Boolean,
        required: true,
    },
    review: {
        type: String,
        required: false,
    },
})
ReviewSchema.index({ userId: 1 })
ReviewSchema.index({ contentId: 1, contentType: 1 })

export const ReviewModel = model<ReviewType>('Review', ReviewSchema)
