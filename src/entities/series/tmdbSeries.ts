import { CreditsResponse, ShowResponse, WatchProviderResponse } from 'moviedb-promise'

export type TmdbSeries = ShowResponse & {
    credits: CreditsResponse,
    "watch/providers": WatchProviderResponse,
    recommendations: { results: ShowResponse[] },
};
