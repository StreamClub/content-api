import { EpisodeResult } from "moviedb-promise";


export class SeasonEpisode {
    airDate: string;
    episodeNumber: number;
    name: string;
    overview: string;
    runtime: string;
    poster: string;

    constructor(tmdbEpisode: EpisodeResult) {
        this.airDate = tmdbEpisode.air_date;
        this.episodeNumber = tmdbEpisode.episode_number;
        this.name = tmdbEpisode.name;
        this.overview = tmdbEpisode.overview;
        this.runtime = tmdbEpisode.runtime;
        this.poster = tmdbEpisode.still_path;
    }
}
