import { TriviaQuestion } from "@entities";
import { TriviaResume } from "./triviaResume";

export class Trivia extends TriviaResume {
    questions: TriviaQuestion[];

    constructor(trivia: Trivia) {
        super(trivia);
        this.questions = trivia.questions.map((question) => new TriviaQuestion(question));
    }

}
