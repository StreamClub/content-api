import { MongoObject } from "@dtos";

export class TriviaResume extends MongoObject {
    contentId: number;
    contentType: string;
    poster: string;
    title: string;

    constructor(trivia: TriviaResume) {
        super(trivia);
        this.contentId = trivia.contentId;
        this.contentType = trivia.contentType
    }

    public setContentInfo(title: string, poster: string) {
        this.poster = poster;
        this.title = title;
    }
}
