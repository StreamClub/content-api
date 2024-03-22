
export class Review {
    public userId: number;
    public contentId: number;
    public contentType: string;
    public liked: boolean;
    public review: string;

    constructor(userId: number, contentId: number, contentType: string, liked: boolean, review: string) {
        this.userId = userId;
        this.contentId = contentId;
        this.contentType = contentType;
        this.liked = liked;
        this.review = review;
    }
}
