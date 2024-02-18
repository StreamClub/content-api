import { TvSeasonResponse } from "moviedb-promise";

export class SeasonResume {
    public id: number;
    public name: string;
    public poster: string;
    public airDate: string;

    constructor(tmdbSeason: TvSeasonResponse) {
        this.id = tmdbSeason.season_number;
        this.name = tmdbSeason.name;
        this.poster = tmdbSeason.poster_path;
        this.airDate = tmdbSeason.air_date;
    }
}
