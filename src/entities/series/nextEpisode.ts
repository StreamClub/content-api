import { Episode } from "moviedb-promise";

export class NextEpisode {
    photo: string;
    airDate: string;
    episodeNumber: number;
    seasonNumber: number;

    constructor(episode: Episode) {
        this.photo = episode.still_path;
        this.airDate = episode.air_date;
        this.episodeNumber = episode.episode_number;
        this.seasonNumber = episode.season_number;
    }
}
