import { SeasonEpisode } from "@entities";

export class NextEpisode {
    photo: string;
    airDate: string;
    name: string;
    episodeNumber: number;
    seasonNumber: number;

    constructor(episode: SeasonEpisode, seasonNumber: number) {
        this.photo = episode.poster;
        this.airDate = episode.airDate;
        this.name = episode.name;
        this.episodeNumber = episode.episodeNumber;
        this.seasonNumber = seasonNumber;
    }
}
