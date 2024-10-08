import { Content } from "@entities";
import { LastSeenEpisode } from "./lastSeenEpisode";
import { TmdbSeries } from "./tmdbSeries";
import { SimilarSeries } from "./similarSeries";
import { SeasonResume } from "./seasonResume";
import { seriesStatus } from "@config";

export class Series extends Content {
    public status: string;
    public createdBy: string[];
    public lastAirDate: string;
    public numberOfEpisodes: number;
    public numberOfSeasons: number;
    public seasons: SeasonResume[];
    public nextEpisode: LastSeenEpisode;
    public similar: SimilarSeries[];
    public seen: number;
    public inWatchlist: boolean;

    constructor(tmdbShow: TmdbSeries, country: string) {
        super(tmdbShow, country);
        this.title = tmdbShow.name;
        this.status = seriesStatus[tmdbShow.status];
        this.createdBy = tmdbShow.created_by.map((creator) => creator.name);
        this.lastAirDate = tmdbShow.last_air_date;
        this.numberOfEpisodes = tmdbShow.number_of_episodes;
        this.numberOfSeasons = tmdbShow.number_of_seasons;
        this.seasons = tmdbShow.seasons.map((season) => new SeasonResume(season));
        if (this.seasons.find((season) => season.id === 0)) this.seasons.push(this.seasons.shift());
        this.similar = tmdbShow.recommendations.results.slice(0, 10).map((series) => new SimilarSeries(series));
        this.releaseDate = tmdbShow.first_air_date;
    }

    public setSeen(totalEpisodes: number, totalWatchedEpisodes: number) {
        this.seen = (totalEpisodes != 0) ? 100 * (totalWatchedEpisodes / totalEpisodes) : 0
    }
}
