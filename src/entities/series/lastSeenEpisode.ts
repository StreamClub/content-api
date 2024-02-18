import { SeasonEpisode } from "@entities";

export class LastSeenEpisode {
    public photo: string;
    public airDate: string;
    public name: string;
    public episodeId: number;
    public seasonId: number;

    constructor(episode: SeasonEpisode, seasonId: number) {
        this.photo = episode.poster;
        this.airDate = episode.airDate;
        this.name = episode.name;
        this.episodeId = episode.episodeId;
        this.seasonId = seasonId;
    }
}
