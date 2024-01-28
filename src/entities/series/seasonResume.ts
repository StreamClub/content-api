import { TvSeasonResponse } from "moviedb-promise";

export class SeasonResume {
    id: number;
    name: string;
    poster: string;
    airDate: string;

    constructor(tmdbSeason: TvSeasonResponse) {
        this.id = tmdbSeason.season_number;
        this.name = tmdbSeason.name;
        this.poster = tmdbSeason.poster_path;
        this.airDate = tmdbSeason.air_date;
    }
}
