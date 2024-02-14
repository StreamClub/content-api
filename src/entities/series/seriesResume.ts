import { TvResult } from "moviedb-promise";

export class SeriesResume {
    id: number;
    title: string;
    poster: string;
    available: boolean;
    releaseDate: string;
    score: number;
    seen: number;
    inWatchlist: boolean;
    status: string;
    lastEpisodeReleaseDate: string;

    constructor(series: TvResult) {
        this.id = series.id;
        this.title = series.name;
        this.poster = series.poster_path;
        this.available = Math.round(Math.random() * 1) == 1; //TODO: cambiar el available segun los servicios del usuario
        this.releaseDate = series.first_air_date;
        this.score = series.vote_average; //TODO: cambiar el score por el de la base de datos
    }

    public setSeen(totalEpisodes: number, totalWatchedEpisodes: number) {
        this.seen = (totalEpisodes != 0) ? 100 * (totalWatchedEpisodes / totalEpisodes) : 0
    }
}
