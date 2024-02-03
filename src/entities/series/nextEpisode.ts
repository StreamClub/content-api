import { SeasonEpisode } from "@entities";
import { Episode } from "moviedb-promise";

export class NextEpisode {
    photo: string;
    airDate: string;
    episodeNumber: number;
    seasonNumber: number;

    constructor(episode: SeasonEpisode, seasonNumber: number) {
        this.photo = episode.poster;
        this.airDate = episode.airDate;
        this.episodeNumber = episode.episodeNumber;
        this.seasonNumber = seasonNumber;
    }
}
