/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import { generateTestJwt, testMovie1, testProviders01 } from '../../helpers';
import { createSeenContentList } from '../../helpers/seenContentHelper';
import { mockGetRedirectLinks, mockMovieInfo } from '../../setup/mocksSetUp';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent/movies';

describe('Add Movie To Seen Content List', () => {
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

    it('should add a movie to the seen list of the user', async () => {
        mockMovieInfo.mockReturnValue(testMovie1);
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        const userId = 1;
        const movieId = testMovie1.id;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createSeenContentList(userId);
        const response = await server.put(`${endpoint}/${movieId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201);
        const getResponse = await server.get(`${endpoint}/${userId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(userId);
        expect(getResponse.body.results[0].movieId).toBe(testMovie1.id);
        expect(getResponse.body.results[0].updatedAt).toBeDefined();
    });

    it('should not add a movie to the seen list of the user if it is already there', async () => {
        mockMovieInfo.mockReturnValue(testMovie1);
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        const userId = 1;
        const movieId = testMovie1.id;
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
        expect(getResponse.body.results.length).toBe(userId);
        expect(getResponse.body.results[0].movieId).toBe(testMovie1.id);
    });

    it('should increment the size of the seen list when adding two movies', async () => {
        const movieId2 = 2151;
        mockMovieInfo.mockReturnValueOnce(testMovie1);
        mockMovieInfo.mockReturnValueOnce({ ...testMovie1, id: movieId2 });
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        const userId = 1;
        const movieId = testMovie1.id;
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
        expect(getResponse.body.results[0].movieId).toBe(movieId2);
        expect(getResponse.body.results[1].movieId).toBe(testMovie1.id);
    });
});
