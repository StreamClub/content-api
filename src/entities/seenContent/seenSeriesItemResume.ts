import { SeriesBasicInfo } from "@entities";
import { SeenSeriesItem } from "./seenSeriesItem";
import { getSeenChaptersPercentage } from "@utils";


export class SeenSeriesItemResume extends SeenSeriesItem {
    public poster: string;
    public seen: number;
    public title: string;

    public constructor(seenSeries: SeenSeriesItem, seriesBasic: SeriesBasicInfo) {
        super(seenSeries);
        this.poster = seriesBasic.poster;
        this.title = seriesBasic.title;
        this.seen = getSeenChaptersPercentage(seenSeries.totalWatchedEpisodes, seriesBasic.numberOfEpisodes)
    }
}
