/// <reference types="@types/jest" />;
/**
* @group series
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockGetSeasonDetails } from '../../setup/mocksSetUp';
import { generateTestJwt, testSeason02 } from '../../helpers';
import { Season } from '@entities';

const endpoint = '/series';

describe('Get Season', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'country', '', 'empty'],
        [400, 'country', 'notACode', 'too long'],
        [400, 'country', 'a', 'too short'],
        [400, 'country', 'ar', 'lowercase'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com")
            const seriesId = 2150;
            const seasonId = 1;
            const response = await
                server.get(`${endpoint}/${seriesId}/seasons/${seasonId}`).query({ [field]: value }).set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return a 404 if the season does not exist', async () => {
        mockGetSeasonDetails.mockRejectedValue({ response: { status: 404 } });
        const testJwt = generateTestJwt(1, "test@test.com")
        const seriesId = 2316;
        const seasonId = 1000;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });

    it('should return a Series with the correct format', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason02);
        const testJwt = generateTestJwt(1, "test@test.com")
        const seriesId = 2150;
        const seasonId = 1;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        const series = response.body as Season;
        expect(response.status).toBe(200);
        expect(series.id).toBe(testSeason02.season_number);
        expect(series.airDate).toBe(testSeason02.air_date);
        expect(series.name).toBe(testSeason02.name);
        expect(series.overview).toBe(testSeason02.overview);
        expect(series.poster).toBe(testSeason02.poster_path);
        expect(series.episodes.length).toBe(testSeason02.episodes.length);
        for (const episode of series.episodes) {
            expect(episode.episodeId).toBeDefined();
            expect(episode.airDate).toBeDefined();
            expect(episode.name).toBeDefined();
            expect(episode.overview).toBeDefined();
            expect(episode.poster).toBeDefined();
            expect(episode.runtime).toBeDefined();
        }
    });

});
