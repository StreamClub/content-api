import { MongoObject } from "@dtos";

export class WatchedTime extends MongoObject {
    year: number;
    month: number;
    timeWatched: number;

    constructor(watchedTime: WatchedTime) {
        super(watchedTime);
        this.year = watchedTime.year;
        this.month = watchedTime.month;
        this.timeWatched = watchedTime.timeWatched;
    }
}
