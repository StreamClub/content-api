import { SeenEpisode } from "./seenEpisode";


export class SeenSeason {
    public seasonId: number;
    public episodes: SeenEpisode[];

    public constructor(seenSeason: SeenSeason) {
        this.seasonId = seenSeason.seasonId;
        this.episodes = seenSeason.episodes.map((episode) => new SeenEpisode(episode));
    }
}
