export class SeenItem {
    public contentType;
    public updatedAt: Date;

    public constructor(contentType: string, updatedAt: Date) {
        this.contentType = contentType;
        this.updatedAt = updatedAt;
    }
}
