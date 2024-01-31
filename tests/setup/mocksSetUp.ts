import { getRedirectLinks } from "@utils"
import { MovieDb } from "moviedb-promise"

export let mockMovieInfo = jest.fn()
export let mockSearchMovie = jest.fn()
export let mockSearchSeries = jest.fn()
export let mockSearchArtist = jest.fn()
export let mockGetRedirectLinks = jest.fn()
export let mockGetShowDetails = jest.fn()
export let mockGetSeasonDetails = jest.fn()

export const setUpMocks = () => {
    getRedirectLinks.prototype = mockGetRedirectLinks
    MovieDb.prototype.searchTv = mockSearchSeries
    MovieDb.prototype.movieInfo = mockMovieInfo
    MovieDb.prototype.tvInfo = mockGetShowDetails
    MovieDb.prototype.searchMovie = mockSearchMovie
    MovieDb.prototype.seasonInfo = mockGetSeasonDetails
    MovieDb.prototype.searchPerson = mockSearchArtist
}
