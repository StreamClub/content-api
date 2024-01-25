import { TestDb } from './testDb'
import request from 'supertest'
import { App } from '../../src/app'
import { MovieDb } from 'moviedb-promise'
import { getRedirectLinks } from '@utils'

export let db: TestDb
export let server: request.SuperTest<request.Test>
export let mockMovieInfo = jest.fn()
export let mockSearchMovie = jest.fn()
export let mockGetRedirectLinks = jest.fn()

export function setupBeforeAndAfter() {
    beforeAll(async () => {
        setUpMocks()
        db = new TestDb()
        await db.initTestDb()
        const app = new App({ db })
        server = request(await app.start())
    })
    afterEach(async () => await db.clearDatabase());
    afterAll(async () => await db.closeDatabase());
}

const setUpMocks = () => {
    getRedirectLinks.prototype = mockGetRedirectLinks
    MovieDb.prototype.movieInfo = mockMovieInfo
    MovieDb.prototype.searchMovie = mockSearchMovie
}
