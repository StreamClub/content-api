import { MongoObject } from "@dtos";

export class Review extends MongoObject {
    public userId: number;
    public contentId: number;
    public contentType: string;
    public liked: boolean;
    public review: string;

    constructor(review: Review) {
        super(review);
        this.userId = review.userId;
        this.contentId = review.contentId;
        this.contentType = review.contentType;
        this.liked = review.liked;
        this.review = review.review;
    }
}
