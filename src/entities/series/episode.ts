import { EpisodeResult } from "moviedb-promise";


export class SeasonEpisode {
    public airDate: string;
    public episodeId: number;
    public seasonId: number;
    public name: string;
    public overview: string;
    public runtime: string;
    public poster: string;
    public seen: boolean;

    constructor(tmdbEpisode: EpisodeResult) {
        this.airDate = tmdbEpisode.air_date;
        this.episodeId = tmdbEpisode.episode_number;
        this.seasonId = tmdbEpisode.season_number;
        this.name = tmdbEpisode.name;
        this.overview = tmdbEpisode.overview;
        this.runtime = tmdbEpisode.runtime;
        this.poster = tmdbEpisode.still_path;
        this.seen = false;
    }
}
