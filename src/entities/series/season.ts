import { SeasonEpisode } from "@entities";
import moment from "moment";
import { EpisodeResult, TvSeasonResponse } from "moviedb-promise";


export class Season {
    id: number;
    airDate: string;
    name: string;
    overview: string;
    poster: string;
    episodes: SeasonEpisode[];

    constructor(tmdbSeason: TvSeasonResponse) {
        this.id = tmdbSeason.season_number;
        this.airDate = tmdbSeason.air_date;
        this.name = tmdbSeason.name;
        this.overview = tmdbSeason.overview;
        this.poster = tmdbSeason.poster_path;
        this.episodes = tmdbSeason.episodes.map((episode: EpisodeResult) => new SeasonEpisode(episode));
    }

    getAiredEpisodes = () => {
        return this.episodes.filter(episode => moment(episode.airDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'));
    }

    toSeenEpisodes = () => {
        const airedEpisodes = this.getAiredEpisodes();
        return airedEpisodes.map(episode => {
            return { episodeId: episode.episodeNumber };
        })

    }
}
