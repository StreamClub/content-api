import { ShowResponse, TvResult } from "moviedb-promise";

export class SeriesResume {
    public id: number;
    public title: string;
    public poster: string;
    public available: boolean;
    public releaseDate: string;
    public score: number;
    public seen: number;
    public inWatchlist: boolean;
    public status: string;
    public lastEpisodeReleaseDate: string;

    constructor(series: TvResult | ShowResponse) {
        this.id = series.id;
        this.title = series.name;
        this.poster = series.poster_path;
        this.releaseDate = series.first_air_date;
        this.score = series.vote_average;
    }

    public setSeen(totalEpisodes: number, totalWatchedEpisodes: number) {
        this.seen = (totalEpisodes != 0) ? 100 * (totalWatchedEpisodes / totalEpisodes) : 0
    }
}
