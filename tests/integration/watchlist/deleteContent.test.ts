/// <reference types="@types/jest" />;
/**
* @group watchlist
*/

import { contentTypes } from '@config';
import { generateTestJwt, testMovie1 } from '../../helpers';
import { addContentToWatchlist, createWatchlist } from '../../helpers/watchlistHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockMovieInfo } from '../../setup/mocksSetUp';

const endpoint = '/watchlist';

describe('Remove Content From Watchlist', () => {
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
            const response = await server.delete(`${endpoint}`)
                .send({ ...body, [field]: value })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should remove a movie to the watchlist of the user', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        await addContentToWatchlist(userId, 2150, contentTypes.MOVIE);
        const response = await server.delete(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.MOVIE });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(0);
    });

    it('should remove a series to the watchlist of the user', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        await addContentToWatchlist(userId, 2150, contentTypes.SERIES);
        const response = await server.delete(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.SERIES });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(0);
    });

    it('should remove the expected content type when theres a movie and a series with same id in the watchlist', async () => {
        mockMovieInfo.mockReturnValue(testMovie1)
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        await addContentToWatchlist(userId, 2150, contentTypes.SERIES);
        await addContentToWatchlist(userId, 2150, contentTypes.MOVIE);
        const response = await server.delete(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.SERIES });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].contentType).toBe(contentTypes.MOVIE);
    });

    it('should respond 200 and do nothing if the content is not in the watchlist', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        const response = await server.delete(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ contentId: 2150, contentType: contentTypes.SERIES });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(0);
    });
});
