import { Content, ProvidersDictionary } from "@entities";
import { NextEpisode } from "./nextEpisode";
import { TmdbSeries } from "./tmdbSeries";
import { SimilarSeries } from "./similarSeries";
import { SeasonResume } from "./seasonResume";

export class Series extends Content {
    status: string;
    createdBy: string[];
    lastAirDate: string;
    numberOfEpisodes: number;
    numberOfSeasons: number;
    seasons: SeasonResume[];
    nextEpisode: NextEpisode;
    similar: SimilarSeries[];

    constructor(tmdbShow: TmdbSeries, country: string, provider: ProvidersDictionary) {
        super(tmdbShow, country, provider);
        this.title = tmdbShow.name;
        this.status = tmdbShow.status;
        this.createdBy = tmdbShow.created_by.map((creator) => creator.name);
        this.lastAirDate = tmdbShow.last_air_date;
        this.numberOfEpisodes = tmdbShow.number_of_episodes;
        this.numberOfSeasons = tmdbShow.number_of_seasons;
        this.seasons = tmdbShow.seasons.map((season) => new SeasonResume(season));
        this.similar = tmdbShow.recommendations.results.slice(0, 10).map((series) => new SimilarSeries(series));
        this.releaseDate = tmdbShow.first_air_date;
        //nextEpisode
    }
}
