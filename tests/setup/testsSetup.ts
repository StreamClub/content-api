import { TestDb } from "./testDb";
import request from 'supertest';
import { App } from '../../src/app';
import { MovieDb } from "moviedb-promise";

export let db: TestDb;
export let server: request.SuperTest<request.Test>;
export let mockMovieInfo = jest.fn();

export function setupBeforeAndAfter() {
    beforeAll(async () => {
        MovieDb.prototype.movieInfo = mockMovieInfo;
        const app = new App({});
        server = request(await app.start(false));
    });
    afterEach(async () => {
        jest.resetAllMocks();
    });
}
