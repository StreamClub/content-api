/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import { generateTestJwt, testMovie1, testProviders01 } from '../../helpers';
import { createSeenContentList, seeMovie } from '../../helpers/seenContentHelper';
import { mockGetRedirectLinks, mockMovieInfo } from '../../setup/mocksSetUp';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent/movies';

describe('Remove Movie From Seen Content List', () => {
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
            const response = await server.delete(`${endpoint}/${movieId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should remove a movie from the seen list of the user', async () => {
        mockMovieInfo.mockReturnValue(testMovie1);
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        const userId = 1;
        const movieId = 2150;
        const testJwt = generateTestJwt(1, "test@test.com");
        await createSeenContentList(userId);
        await seeMovie(userId, movieId);
        const getResponseBefore = await server.get(`${endpoint}/${userId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponseBefore.status).toBe(200);
        expect(getResponseBefore.body.results.length).toBe(1);
        const response = await server.delete(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const getResponseAfter = await server.get(`${endpoint}/${userId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponseAfter.status).toBe(200);
        expect(getResponseAfter.body.results.length).toBe(0);
    });

    it('should delete just the movie with the given id from the seen list of the user', async () => {
        mockMovieInfo.mockReturnValue(testMovie1);
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        const userId = 1;
        const movieId = 2150;
        const testJwt = generateTestJwt(1, "test@test.com");
        await createSeenContentList(userId);
        seeMovie(userId, movieId);
        const movieId2 = 2151;
        seeMovie(userId, movieId2);
        const getResponseBefore = await server.get(`${endpoint}/${userId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponseBefore.status).toBe(200);
        expect(getResponseBefore.body.results.length).toBe(2);
        const response = await server.delete(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const getResponseAfter = await server.get(`${endpoint}/${userId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponseAfter.status).toBe(200);
        expect(getResponseAfter.body.results.length).toBe(1);
        expect(getResponseAfter.body.results[0].movieId).toBe(movieId2);
    });

    it('should return 200 when trying to remove a movie that is not in the seen list', async () => {
        mockMovieInfo.mockReturnValue(testMovie1);
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        const userId = 1;
        const movieId = 2150;
        const testJwt = generateTestJwt(1, "test@test.com");
        await createSeenContentList(userId);
        const response = await server.delete(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
    });

});