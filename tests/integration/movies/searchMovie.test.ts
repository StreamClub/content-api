/// <reference types="@types/jest" />;
/**
* @group movies
*/

import { MAX_STRING_LENGTH } from '@config';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockGetRedirectLinks, mockMovieInfo, mockSearchMovie } from '../../setup/mocksSetUp';
import { generateTestJwt, movieSearch1, testMovie1, testProviders01 } from '../../helpers';

const endpoint = '/movies';

describe('Search Movie', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'query', '', 'empty'],
        [400, 'query', 'a'.repeat(MAX_STRING_LENGTH + 1), 'too long'],
        [400, 'page', '0', 'zero'],
        [400, 'page', '-1', 'negative'],
        [400, 'page', 'notANumber', 'not a number'],
        [400, 'page', '1.5', 'not an integer'],
        [400, 'page', '', 'empty'],
        [400, 'country', '', 'empty'],
        [400, 'country', 'notACode', 'too long'],
        [400, 'country', 'a', 'too short'],
        [400, 'country', 'ar', 'lowercase'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const validQuery = {
                page: 1,
                query: "something",
                country: 'AR'
            }
            const testJwt = generateTestJwt(1, "test@test.com");
            const response = await server.get(`${endpoint}`)
                .query({ ...validQuery, [field]: value })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return a list of movies with the correct format', async () => {
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        mockMovieInfo.mockReturnValue(testMovie1);
        mockSearchMovie.mockReturnValue(movieSearch1);
        const query = 'test';
        const country = 'AR';
        const testJwt = generateTestJwt(1, "test@test.com");
        const page = 1;
        const response = await server.get(`${endpoint}`)
            .query({ query, page, country })
            .set('Authorization', `Bearer ${testJwt}`);
        const movies = response.body.results;
        expect(response.status).toBe(200);
        expect(movies.length).toBeLessThanOrEqual(20);
        for (const movie of movies) {
            expect(movie.id).toBeDefined();
            expect(movie.title).toBeDefined();
            expect(movie.poster).toBeDefined();
            expect(movie.available).toBeDefined();
            expect(movie.releaseDate).toBeDefined();
            expect(movie.score).toBeDefined();
            expect(movie.seen).toBeDefined();
            expect(movie.inWatchlist).toBeDefined();
        }
        expect(response.body.page).toBeGreaterThanOrEqual(1);
        expect(response.body.totalPages).toBeGreaterThanOrEqual(0);
        expect(response.body.totalResults).toBeGreaterThanOrEqual(0);
    });
});
