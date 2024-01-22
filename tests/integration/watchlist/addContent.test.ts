/// <reference types="@types/jest" />;
/**
* @group watchlist
*/
import { contentTypes } from '@config';
import { generateTestJwt } from '../../helpers';
import { createWatchlist } from '../../helpers/watchlistHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/watchlist';

describe('Add Content To Watchlist', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'contentId', 'notANumber', 'not a number'],
        [400, 'contentId', -1, 'negative number'],
        [400, 'contentId', 0, 'zero'],
        [400, 'contentId', 1.5, 'not integer'],
        [400, 'contentType', 'notAContentType', 'not a content type'],
        [400, 'contentType', 12, 'not a string'],

    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const body = { contentId: 2150, contentType: contentTypes.MOVIE };
            const response = await server.put(`${endpoint}`)
                .send({ ...body, [field]: value })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return 404 when trying to add content to a watchlist of a user without watchlist', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.MOVIE });
        expect(response.status).toBe(404);
    });

    it('should add a movie to the watchlist of the user', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.MOVIE });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].id).toBe(2150);
        expect(getResponse.body.results[0].contentType).toBe(contentTypes.MOVIE);
        expect(getResponse.body.results[0].createdAt).toBeDefined();
    });

    it('should add a series to the watchlist of the user', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.SERIES });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].id).toBe(2150);
        expect(getResponse.body.results[0].contentType).toBe(contentTypes.SERIES);
        expect(getResponse.body.results[0].createdAt).toBeDefined();
    });

    it('should let you add a movie and a series with the same id to the watchlist of the user', async () => {
        const userId = 1;
        const contentId = 2150;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId, contentType: contentTypes.SERIES });
        expect(response.status).toBe(200);
        const response2 = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId, contentType: contentTypes.MOVIE });
        expect(response2.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(2);
        expect(getResponse.body.results[0].id).toBe(contentId);
        expect(getResponse.body.results[0].contentType).toBe(contentTypes.MOVIE);
        expect(getResponse.body.results[1].id).toBe(contentId);
        expect(getResponse.body.results[1].contentType).toBe(contentTypes.SERIES);
    });

    it('should not add a movie to the watchlist of the user if it is already there', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.MOVIE });
        expect(response.status).toBe(200);
        const response2 = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.MOVIE });
        expect(response2.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].id).toBe(2150);
    });


    it('should not add a series to the watchlist of the user if it is already there', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.SERIES });
        expect(response.status).toBe(200);
        const response2 = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.SERIES });
        expect(response2.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].id).toBe(2150);
    });
});
