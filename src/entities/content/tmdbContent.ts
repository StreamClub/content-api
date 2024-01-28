import { CreditsResponse, MovieResponse, ShowResponse, VideosResponse, WatchProviderResponse } from 'moviedb-promise'

export type TmdbContent = (MovieResponse | ShowResponse) & {
    credits: CreditsResponse,
    "watch/providers": WatchProviderResponse,
    recommendations: { results: (MovieResponse | ShowResponse)[] },
    videos: VideosResponse
};
