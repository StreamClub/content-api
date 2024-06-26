/// <reference types="@types/jest" />;
/**
* @group series
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockGetRedirectLinks, mockGetSeasonDetails, mockGetShowDetails } from '../../setup/mocksSetUp';
import { generateTestJwt, testSeason02, testSeries02 } from '../../helpers';
import { Series } from '@entities';
import { testSeason01, testSeries01, testProviders01 } from '../../helpers';
import { seriesStatus } from '@config';
import { createSeenContentList, seeEpisode } from '../../helpers/seenContentHelper';
import { createStreamProvidersList } from '../../helpers/streamProviderHelper';

const endpoint = '/series';

describe('Get Series', () => {
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
        mockGetSeasonDetails.mockReturnValue(testSeason01);
        mockGetRedirectLinks.mockReturnValue(testProviders01);
        const testJwt = generateTestJwt(1, "test@test.com")
        await createStreamProvidersList(1);
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
        expect(series.genres).toStrictEqual(testSeries01.genres.map((genre: any) => genre.name));
        expect(series.status).toBe(seriesStatus[testSeries01.status]);
        expect(series.createdBy).toStrictEqual(testSeries01.created_by.map((creator: any) => creator.name));
        expect(series.lastAirDate).toBe(testSeries01.last_air_date);
        expect(series.numberOfEpisodes).toBe(testSeries01.number_of_episodes);
        expect(series.numberOfSeasons).toBe(testSeries01.number_of_seasons);
        expect(series.userReview).toBeDefined();
        expect(series.seasons).toStrictEqual(testSeries01.seasons.map((season: any) => {
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
        expect(series.releaseDate).toBe(testSeries01.first_air_date);
        expect(series.nextEpisode).toBeDefined();
    });

    it('should return a 404 if the series does not exist', async () => {
        mockGetShowDetails.mockRejectedValue({ response: { status: 404 } });
        const testJwt = generateTestJwt(1, "test@test.com")
        await createStreamProvidersList(1);
        const id = 0;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });

    it('should return the fist episode as next episode if the user has not watched any episode', async () => {
        mockGetShowDetails.mockReturnValue(testSeries02);
        mockGetSeasonDetails.mockReturnValue(testSeason01);
        mockGetRedirectLinks.mockReturnValue(testProviders01);
        const testJwt = generateTestJwt(1, "test@test.com")
        await createStreamProvidersList(1);
        const id = 2150;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        const series = response.body as Series;
        expect(response.status).toBe(200);
        expect(series.nextEpisode.seasonId).toBe(testSeason01.season_number);
        expect(series.nextEpisode.episodeId).toBe(testSeason01.episodes[0].episode_number);
    });

    it('should return the second episode as next episode if the user has watched the first episode', async () => {
        mockGetShowDetails.mockReturnValue(testSeries02);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason02);
        mockGetRedirectLinks.mockReturnValue(testProviders01);
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com")
        await createStreamProvidersList(userId);
        await createSeenContentList(userId);
        await seeEpisode(userId, testSeries02.id, 1, 1);
        const id = testSeries02.id;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        const series = response.body as Series;
        expect(response.status).toBe(200);
        expect(series.nextEpisode.seasonId).toBe(testSeason01.season_number);
        expect(series.nextEpisode.episodeId).toBe(testSeason01.episodes[1].episode_number);
    });

    it('should return the first episode of the second season as next episode if the user has watched the last episodes of the first season', async () => {
        mockGetShowDetails.mockReturnValue(testSeries02);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason02);
        mockGetRedirectLinks.mockReturnValue(testProviders01);
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com")
        await createStreamProvidersList(userId);
        await createSeenContentList(userId);
        await seeEpisode(userId, testSeries02.id, 1, 61);
        const id = testSeries02.id;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        const series = response.body as Series;
        expect(response.status).toBe(200);
        expect(series.nextEpisode.seasonId).toBe(testSeason02.season_number);
        expect(series.nextEpisode.episodeId).toBe(testSeason02.episodes[0].episode_number);
    });

});
