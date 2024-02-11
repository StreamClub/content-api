/// <reference types="@types/jest" />;
/**
* @group watchlist
*/
import { generateTestJwt } from '../../helpers';
import { createSeenContentList } from '../../helpers/seenContentHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent/movies';

describe('Add Content To Watchlist', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'movieId', 'notANumber', 'not a number'],
        [400, 'movieId', -1, 'negative number'],
        [400, 'movieId', 0, 'zero'],
        [400, 'movieId', 1.5, 'not integer'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const movieId = value;
            const response = await server.put(`${endpoint}/${movieId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return 404 when trying to add a movie to of a user without seen list', async () => {
        const userId = 1;
        const movieId = 2150;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.put(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(404);
    });

    it('should add a movie to the seen list of the user', async () => {
        const userId = 1;
        const movieId = 2150;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createSeenContentList(userId);
        const response = await server.put(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201);
        const getResponse = await server.get(`${endpoint}/${userId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].movieId).toBe(2150);
        expect(getResponse.body.results[0].updatedAt).toBeDefined();
    });

    it('should not add a movie to the seen list of the user if it is already there', async () => {
        const userId = 1;
        const movieId = 2150;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createSeenContentList(userId);
        const response = await server.put(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201);
        const response2 = await server.put(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response2.status).toBe(201);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].movieId).toBe(2150);
    });

    it('should increment the size of the seen list when adding two movies', async () => {
        const userId = 1;
        const movieId = 2150;
        const movieId2 = 2151;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createSeenContentList(userId);
        const response = await server.put(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201);
        const response2 = await server.put(`${endpoint}/${movieId2}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response2.status).toBe(201);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(2);
        expect(getResponse.body.results[0].movieId).toBe(2151);
        expect(getResponse.body.results[1].movieId).toBe(2150);
    });
});
