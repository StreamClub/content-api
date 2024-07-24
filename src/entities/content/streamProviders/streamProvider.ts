import { MongoObject } from "@dtos";
import { WatchedTime } from "./watchedTime";

export class StreamProvider extends MongoObject {
    providerId: number;
    watchedTime: WatchedTime[];

    constructor(streamProvider: StreamProvider) {
        super(streamProvider);
        this.providerId = streamProvider.providerId;
        this.watchedTime = streamProvider.watchedTime.map(watchedTime => new WatchedTime(watchedTime));
    }
}
