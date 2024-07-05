import { TriviaQuestion } from '@entities'
import { Document, Schema } from 'mongoose'

type TriviaQuestionType = TriviaQuestion & Document

export const TriviaQuestionSchema = new Schema<TriviaQuestionType>({

    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },

})
