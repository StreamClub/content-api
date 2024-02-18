import { LastSeenEpisode } from "@entities";
import { SeenItem } from "./seenItem";

export class SeenSeriesItem extends SeenItem {
    public totalWatchedEpisodes: number;
    public lastSeenEpisode: LastSeenEpisode

    public constructor(seenSeries: SeenSeriesItem) {
        super(seenSeries.id, "series", seenSeries.updatedAt);
        this.totalWatchedEpisodes = seenSeries.totalWatchedEpisodes;
        this.lastSeenEpisode = seenSeries.lastSeenEpisode;
    }
}
