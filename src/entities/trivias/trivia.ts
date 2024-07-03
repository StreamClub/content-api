import { MongoObject } from "@dtos";
import { Content } from "@entities";

export class Trivia extends MongoObject {
    contentId: number;
    contentType: string;
    poster: string;
    title: string;

    constructor(trivia: Trivia) {
        super(trivia);
        this.contentId = trivia.contentId;
        this.contentType = trivia.contentType
    }

    public setContentInfo(title: string, poster: string) {
        this.poster = poster;
        this.title = title;
    }
}
