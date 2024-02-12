/// <reference types="@types/jest" />;
/**
* @group series
*/

import { MAX_STRING_LENGTH } from '@config';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { generateTestJwt } from '../../helpers';
import { mockGetShowDetails, mockSearchSeries } from '../../setup/mocksSetUp';
import { testSearchSeries01, testSeries01 } from '../../helpers/mocks/testSeries';

const endpoint = '/series';

describe('Search Series', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'query', '', 'empty'],
        [400, 'query', 'a'.repeat(MAX_STRING_LENGTH + 1), 'too long'],
        [400, 'page', '0', 'zero'],
        [400, 'page', '-1', 'negative'],
        [400, 'page', 'notANumber', 'not a number'],
        [400, 'page', '1.5', 'not an integer'],
        [400, 'page', '', 'empty'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const response = await server.get(`${endpoint}`)
                .query({ [field]: value })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return a list of series with the correct format', async () => {
        mockSearchSeries.mockReturnValue(testSearchSeries01);
        mockGetShowDetails.mockReturnValue(testSeries01);
        const query = 'test';
        const testJwt = generateTestJwt(1, "test@test.com");
        const page = 1;
        const response = await server.get(`${endpoint}`)
            .query({ query, page }).set('Authorization', `Bearer ${testJwt}`);
        const series = response.body.results;
        expect(response.status).toBe(200);
        expect(series.length).toBeLessThanOrEqual(20);
        for (const serie of series) {
            expect(serie.id).toBeDefined();
            expect(serie.title).toBeDefined();
            expect(serie.poster).toBeDefined();
            expect(serie.available).toBeDefined();
            expect(serie.score).toBeDefined();
            expect(serie.seen).toBeDefined();
            expect(serie.inWatchlist).toBeDefined();
            expect(serie.releaseDate).toBeDefined();
            expect(serie.status).toBeDefined();
            expect(serie.lastEpisodeReleaseDate).toBeDefined();
        }
        expect(response.body.page).toBeGreaterThanOrEqual(1);
        expect(response.body.totalPages).toBeGreaterThanOrEqual(0);
        expect(response.body.totalResults).toBeGreaterThanOrEqual(0);
    });
});
