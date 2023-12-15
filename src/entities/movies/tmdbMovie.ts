import { CreditsResponse, MovieResponse, WatchProviderResponse } from 'moviedb-promise'


export type TmdbMovie = MovieResponse & { credits: CreditsResponse, "watch/providers": WatchProviderResponse };
