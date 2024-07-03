import { MongoObject } from "@dtos";

export class Trivia extends MongoObject {
    contentId: number;
    contentType: string;

    constructor(trivia: Trivia) {
        super(trivia);
        this.contentId = trivia.contentId;
        this.contentType = trivia.contentType
    }
}
