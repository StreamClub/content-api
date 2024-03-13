import { SeasonEpisode } from "@entities";
import moment from "moment";
import { EpisodeResult, TvSeasonResponse } from "moviedb-promise";


export class Season {
    public id: number;
    public airDate: string;
    public name: string;
    public overview: string;
    public poster: string;
    public episodes: SeasonEpisode[];
    public seen: boolean;

    constructor(tmdbSeason: TvSeasonResponse) {
        this.id = tmdbSeason.season_number;
        this.airDate = tmdbSeason.air_date;
        this.name = tmdbSeason.name;
        this.overview = tmdbSeason.overview;
        this.poster = tmdbSeason.poster_path;
        this.seen = false;
        this.episodes = tmdbSeason.episodes.map((episode: EpisodeResult) => new SeasonEpisode(episode));
    }

    setSeenEpisodes = (seenEpisodes: number[]) => {
        this.episodes.forEach(episode => {
            episode.seen = seenEpisodes.includes(episode.episodeId);
        });
        if (seenEpisodes.length === this.episodes.length) {
            this.seen = true;
        }
    }

    getAiredEpisodes = () => {
        if (!this.episodes || this.episodes.length === 0) {
            return [];
        }
        return this.episodes.filter(episode => moment(episode.airDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'));
    }

    toSeenEpisodes = () => {
        const airedEpisodes = this.getAiredEpisodes();
        return airedEpisodes.map(episode => {
            return { episodeId: episode.episodeId, seasonId: this.id };
        })
    }

    getLastAiredEpisode = () => {
        if (!this.episodes || this.episodes.length === 0) {
            return null;
        }
        return this.getAiredEpisodes().reduce((prev, current) => (prev.airDate > current.airDate) ? prev : current);
    }

    getLatestEpisode = (seenEpisode: SeasonEpisode) => {
        if (!seenEpisode) {
            seenEpisode = this.getLastAiredEpisode();
        }
        if (seenEpisode.seasonId < this.getLastAiredEpisode().seasonId) {
            seenEpisode = this.getLastAiredEpisode();
        }
        return seenEpisode;

    }
}
