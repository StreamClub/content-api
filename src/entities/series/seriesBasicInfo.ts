import { Content, ProvidersDictionary } from "@entities";
import { LastSeenEpisode } from "./lastSeenEpisode";
import { TmdbSeries } from "./tmdbSeries";
import { SimilarSeries } from "./similarSeries";
import { ShowResponse } from "moviedb-promise";

export class SeriesBasicInfo {
    public numberOfEpisodes: number;
    public poster: string;
    public title: string;

    constructor(tmdbShow: ShowResponse) {
        this.numberOfEpisodes = tmdbShow.number_of_episodes;
        this.poster = tmdbShow.poster_path;
        this.title = tmdbShow.name;
    }
}
