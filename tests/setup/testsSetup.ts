import { TestDb } from './testDb'
import request from 'supertest'
import { App } from '../../src/app'
import { MovieDb } from 'moviedb-promise'

export let db: TestDb
export let server: request.SuperTest<request.Test>
export let mockMovieInfo = jest.fn()
export let mockSearchMovie = jest.fn()

export function setupBeforeAndAfter() {
    beforeAll(async () => {
        setUpMocks()
        db = new TestDb()
        const app = new App({ db })
        server = request(await app.start())
    })
    afterEach(async () => {
        jest.resetAllMocks()
    })
}

const setUpMocks = () => {
    MovieDb.prototype.movieInfo = mockMovieInfo
    MovieDb.prototype.searchMovie = mockSearchMovie
}
