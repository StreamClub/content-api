import { TestDb } from "./testDb";
import request from 'supertest';
import { App } from '../../src/app';
import { MovieDb } from "moviedb-promise";

export let db: TestDb;
export let server: request.SuperTest<request.Test>;
export let mockMovieInfo = jest.fn();
export let mockSearchMovie = jest.fn();

export function setupBeforeAndAfter() {
    beforeAll(async () => {
        setUpMocks();
        const app = new App({});
        server = request(await app.start(false));
    });
    afterEach(async () => {
        jest.resetAllMocks();
    });
}

const setUpMocks = () => {
    MovieDb.prototype.movieInfo = mockMovieInfo;
    MovieDb.prototype.searchMovie = mockSearchMovie;
}
