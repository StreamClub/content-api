import { MovieDb } from "moviedb-promise"

export let mockMovieInfo = jest.fn()
export let mockGetMovieCredits = jest.fn()
export let mockSearchMovie = jest.fn()
export let mockSearchSeries = jest.fn()
export let mockGetSeriesCredits = jest.fn()
export let mockSearchArtist = jest.fn()
export let mockGetRedirectLinks = jest.spyOn(require('../../src/utils/getRedirectLinks'), 'getRedirectLinks');
export let mockGetShowDetails = jest.fn()
export let mockGetSeasonDetails = jest.fn()
export let mockGetArtistDetails = jest.fn()
export let mockGetStreamServices = jest.fn()

export const setUpMocks = () => {
    MovieDb.prototype.searchTv = mockSearchSeries
    MovieDb.prototype.movieInfo = mockMovieInfo
    MovieDb.prototype.movieCredits = mockGetMovieCredits
    MovieDb.prototype.tvInfo = mockGetShowDetails
    MovieDb.prototype.searchMovie = mockSearchMovie
    MovieDb.prototype.seasonInfo = mockGetSeasonDetails
    MovieDb.prototype.tvCredits = mockGetSeriesCredits
    MovieDb.prototype.searchPerson = mockSearchArtist
    MovieDb.prototype.personInfo = mockGetArtistDetails
    MovieDb.prototype.movieWatchProviderList = mockGetStreamServices
}
