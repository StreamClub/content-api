import { MongoObject } from "@dtos";
import { WatchedTime } from "./watchedTime";

export class OtherStreamProviders extends MongoObject {
    public userId: number;
    watchedTime: WatchedTime[];

    constructor(providers: OtherStreamProviders) {
        super(providers);
        this.userId = providers.userId;
        this.watchedTime = providers.watchedTime.map(watchedTime => new WatchedTime(watchedTime));
    }
}