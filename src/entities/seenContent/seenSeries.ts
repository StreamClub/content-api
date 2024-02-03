import { NextEpisode, SeenSeason } from "@entities";

export class SeenSeries {
    public seriesId: number;
    public seasons: SeenSeason[];
    public totalWatchedEpisodes: number;
    public nextEpisode: NextEpisode

    public constructor(seenSeries: SeenSeries) {
        this.seriesId = seenSeries.seriesId;
    }
}
