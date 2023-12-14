import { TestDb } from "./testDb";
import request from 'supertest';
import { App } from '../../src/app';

export let db: TestDb;
export let server: request.SuperTest<request.Test>;
export let mockSendMail = jest.fn();

export function setupBeforeAndAfter() {
    beforeAll(async () => {
        const app = new App({});
        server = request(await app.start(false));
    });
}
