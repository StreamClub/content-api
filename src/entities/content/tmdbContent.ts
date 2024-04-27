import { CreditsResponse, MovieResponse, ShowResponse, WatchProviderResponse } from 'moviedb-promise'

export type TmdbContent = (MovieResponse | ShowResponse) & {
    credits: CreditsResponse,
    "watch/providers": WatchProviderResponse,
    recommendations: { results: (MovieResponse | ShowResponse)[] },
};
