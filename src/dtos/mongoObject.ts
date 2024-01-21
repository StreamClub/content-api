export class MongoObject {
    id: string;
    _id: string;
    constructor(mongoObject: any) {
        this.id = mongoObject._id.toString();
    }
}
