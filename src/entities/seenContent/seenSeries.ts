import { NextEpisode as LastSeenEpisode, SeenSeason } from "@entities";

export class SeenSeries {
    public seriesId: number;
    public seasons: SeenSeason[];
    public totalWatchedEpisodes: number;
    public lastSeenEpisode: LastSeenEpisode

    public constructor(seenSeries: SeenSeries) {
        this.seriesId = seenSeries.seriesId;
        this.seasons = seenSeries.seasons.map((season) => new SeenSeason(season));
        this.totalWatchedEpisodes = seenSeries.totalWatchedEpisodes;
        this.lastSeenEpisode = seenSeries.lastSeenEpisode;
    }
}
