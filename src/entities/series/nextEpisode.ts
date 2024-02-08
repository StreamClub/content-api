import { SeasonEpisode } from "@entities";

export class NextEpisode {
    photo: string;
    airDate: string;
    name: string;
    episodeId: number;
    seasonId: number;

    constructor(episode: SeasonEpisode, seasonId: number) {
        this.photo = episode.poster;
        this.airDate = episode.airDate;
        this.name = episode.name;
        this.episodeId = episode.episodeId;
        this.seasonId = seasonId;
    }
}
