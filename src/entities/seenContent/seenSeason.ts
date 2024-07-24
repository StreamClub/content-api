import { SeenSeries } from "@entities";
import { SeenEpisode } from "./seenEpisode";

export class SeenSeason {
    public seasonId: number;
    public episodes: SeenEpisode[];

    public constructor(seasonId: number, episodes: SeenEpisode[]) {
        this.seasonId = seasonId;
        this.episodes = episodes.map((episode) => new SeenEpisode(episode));
    }

    public getUnseenSeasonEpisodes(seenSeries: SeenSeries) {
        const seasonIndex = seenSeries?.seasons.findIndex(seenSeason => seenSeason.seasonId === this.seasonId);
        if (!seenSeries || seasonIndex === -1) {
            return this.episodes;
        } else {
            const existingEpisodeIds = seenSeries.seasons[seasonIndex].episodes.map(ep => ep.episodeId);
            return this.episodes.filter(episode => !existingEpisodeIds.includes(episode.episodeId));
        }
    }
}
