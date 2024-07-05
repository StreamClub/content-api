import { MongoObject } from "@dtos";

export class TriviaQuestion extends MongoObject {
    question: string;
    options: string[];
    correctAnswer: string;

    constructor(trivia: TriviaQuestion) {
        super(trivia);
        this.question = trivia.question;
        this.options = trivia.options;
        this.correctAnswer = trivia.correctAnswer;
    }
}
