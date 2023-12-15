import { CreditsResponse, MovieResponse, VideosResponse, WatchProviderResponse } from 'moviedb-promise'

export type TmdbMovie = MovieResponse & {
    credits: CreditsResponse,
    "watch/providers": WatchProviderResponse,
    recommendations: { results: MovieResponse[] },
    videos: VideosResponse
};
