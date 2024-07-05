import { Trivia } from '@entities'
import { Document, model, Schema } from 'mongoose'
import { TriviaQuestionSchema } from './triviaQuestionModel'

type TriviaType = Trivia & Document

const TriviaSchema = new Schema<TriviaType>({
    contentId: {
        type: Number,
        required: true,
        unique: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    questions: {
        type: [TriviaQuestionSchema],
        required: true,
    },

})
TriviaSchema.index({ contentId: 1, contentType: 1 }, { unique: true })

export const TriviaModel = model<TriviaType>('Trivia', TriviaSchema)
