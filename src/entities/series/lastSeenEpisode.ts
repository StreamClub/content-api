import { SeasonEpisode } from "@entities";

export class LastSeenEpisode {
    public photo: string;
    public airDate: string;
    public name: string;
    public episodeId: number;
    public seasonId: number;

    constructor(episode: SeasonEpisode, seasonId: number) {
        this.photo = episode?.poster ? episode.poster : null;
        this.airDate = episode?.airDate ? episode.airDate : null;
        this.name = episode?.name ? episode.name : null;
        this.episodeId = episode?.episodeId ? episode.episodeId : null;
        this.seasonId = seasonId;
    }
}
