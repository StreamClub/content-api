import { SeriesBasicInfo } from "@entities";
import { SeenSeriesItem } from "./seenSeriesItem";
import { getSeenChaptersPercentage } from "@utils";


export class SeenSeriesItemResume extends SeenSeriesItem {
    public poster: string;
    public seen: number;

    public constructor(seenSeries: SeenSeriesItem, seriesBasic: SeriesBasicInfo) {
        super(seenSeries);
        this.poster = seriesBasic.poster;
        this.seen = getSeenChaptersPercentage(seenSeries.totalWatchedEpisodes, seriesBasic.numberOfEpisodes)
    }
}
