import { Content, ProvidersDictionary } from "@entities";
import { LastSeenEpisode } from "./lastSeenEpisode";
import { TmdbSeries } from "./tmdbSeries";
import { SimilarSeries } from "./similarSeries";
import { SeasonResume } from "./seasonResume";
import { seriesStatus as seriesStatus } from "@config";

export class Series extends Content {
    status: string;
    createdBy: string[];
    lastAirDate: string;
    numberOfEpisodes: number;
    numberOfSeasons: number;
    seasons: SeasonResume[];
    nextEpisode: LastSeenEpisode;
    similar: SimilarSeries[];

    constructor(tmdbShow: TmdbSeries, country: string, provider: ProvidersDictionary, nextEpisode: LastSeenEpisode) {
        super(tmdbShow, country, provider);
        this.title = tmdbShow.name;
        this.status = seriesStatus[tmdbShow.status];
        this.createdBy = tmdbShow.created_by.map((creator) => creator.name);
        this.lastAirDate = tmdbShow.last_air_date;
        this.numberOfEpisodes = tmdbShow.number_of_episodes;
        this.numberOfSeasons = tmdbShow.number_of_seasons;
        this.seasons = tmdbShow.seasons.map((season) => new SeasonResume(season));
        this.similar = tmdbShow.recommendations.results.slice(0, 10).map((series) => new SimilarSeries(series));
        this.releaseDate = tmdbShow.first_air_date;
        this.nextEpisode = nextEpisode;
    }
}
