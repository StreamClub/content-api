import { LastSeenEpisode } from "@entities";
import { SeenItem } from "./seenItem";

export class SeenSeriesItem extends SeenItem {
    public seriesId: number;
    public totalWatchedEpisodes: number;
    public lastSeenEpisode: LastSeenEpisode

    public constructor(seenSeries: SeenSeriesItem) {
        super("series", seenSeries.updatedAt);
        this.seriesId = seenSeries.seriesId;
        this.totalWatchedEpisodes = seenSeries.totalWatchedEpisodes;
        this.lastSeenEpisode = seenSeries.lastSeenEpisode;
    }
}
