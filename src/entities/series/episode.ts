import { EpisodeResult } from "moviedb-promise";


export class SeasonEpisode {
    airDate: string;
    episodeId: number;
    seasonId: number;
    name: string;
    overview: string;
    runtime: string;
    poster: string;

    constructor(tmdbEpisode: EpisodeResult) {
        this.airDate = tmdbEpisode.air_date;
        this.episodeId = tmdbEpisode.episode_number;
        this.seasonId = tmdbEpisode.season_number;
        this.name = tmdbEpisode.name;
        this.overview = tmdbEpisode.overview;
        this.runtime = tmdbEpisode.runtime;
        this.poster = tmdbEpisode.still_path;
    }
}
