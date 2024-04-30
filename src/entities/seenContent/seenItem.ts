export class SeenItem {
    public contentType;
    public updatedAt: Date;
    public id: number;
    public hasReview: boolean;
    public liked: boolean;

    public constructor(id: number, contentType: string, updatedAt: Date) {
        this.contentType = contentType;
        this.updatedAt = updatedAt;
        this.id = id;
    }
}
