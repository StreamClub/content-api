export class MongoObject {
    id: string;
    _id: string;
    constructor(mongoObject: MongoObject) {
        this.id = mongoObject._id.toString();
    }
}
