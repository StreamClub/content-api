import { CreditsResponse, ShowResponse, VideosResponse, WatchProviderResponse } from 'moviedb-promise'

export type TmdbSeries = ShowResponse & {
    credits: CreditsResponse,
    "watch/providers": WatchProviderResponse,
    recommendations: { results: ShowResponse[] },
    videos: VideosResponse
};
