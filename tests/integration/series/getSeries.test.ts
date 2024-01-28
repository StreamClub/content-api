/// <reference types="@types/jest" />;
/**
* @group series
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockGetRedirectLinks, mockGetShowDetails } from '../../setup/mocksSetUp';
import { generateTestJwt, testSeries01 } from '../../helpers';
import { Series } from '@entities';
import { testProviders01 } from '../../helpers/testProviders';
import { seriesStatus } from '@config';

const endpoint = '/series';

describe('Get Movie', () => {
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
            const id = 2150;
            const response = await
                server.get(`${endpoint}/${id}`).query({ [field]: value }).set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return a Series with the correct format', async () => {
        mockGetShowDetails.mockReturnValue(testSeries01);
        mockGetRedirectLinks.mockResolvedValue(testProviders01);
        const testJwt = generateTestJwt(1, "test@test.com")
        const id = 2150;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        const series = response.body as Series;
        expect(response.status).toBe(200);
        expect(series.id).toBe(testSeries01.id);
        expect(series.title).toBe(testSeries01.name);
        expect(series.overview).toBe(testSeries01.overview);
        expect(series.poster).toBe(testSeries01.poster_path);
        expect(series.backdrop).toBe(testSeries01.backdrop_path);
        expect(series.genres).toStrictEqual(testSeries01.genres.map((genre) => genre.name));
        expect(series.status).toBe(seriesStatus[testSeries01.status]);
        expect(series.createdBy).toStrictEqual(testSeries01.created_by.map((creator) => creator.name));
        expect(series.lastAirDate).toBe(testSeries01.last_air_date);
        expect(series.numberOfEpisodes).toBe(testSeries01.number_of_episodes);
        expect(series.numberOfSeasons).toBe(testSeries01.number_of_seasons);
        expect(series.seasons).toStrictEqual(testSeries01.seasons.map((season) => {
            return {
                id: season.season_number,
                name: season.name,
                poster: season.poster_path,
                airDate: season.air_date,
            }
        }));
        expect(series.platforms.length).toBeGreaterThanOrEqual(1);
        expect(series.cast.length).toBeLessThanOrEqual(10);
        expect(series.similar.length).toBeLessThanOrEqual(10);
        for (const trailer of series.trailers) {
            expect(trailer.site).toBe('YouTube');
            expect(trailer.type).toBe('Trailer');
        }
        expect(series.releaseDate).toBe(testSeries01.first_air_date);
        expect(series.trailers).toBeDefined();
    });

    it('should return a 404 if the series does not exist', async () => {
        mockGetShowDetails.mockRejectedValue({ response: { status: 404 } });
        const testJwt = generateTestJwt(1, "test@test.com")
        const id = 0;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });
});
