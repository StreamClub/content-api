/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import { generateTestJwt, testSeason01, testSpecialSeason01 } from '../../helpers';
import { createSeenContentList, getSeenContentList, seeEpisode } from '../../helpers/seenContentHelper';
import { mockGetSeasonDetails } from '../../setup/mocksSetUp';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent/series';

describe('Add Content To Watchlist', () => {
    setupBeforeAndAfter();

    const invalidSeriesIdCases = [
        [400, 'seasonId', 'notANumber', 'not a number'],
        [400, 'seasonId', -1, 'negative number'],
        [400, 'seasonId', 0, 'zero'],
        [400, 'seasonId', 1.5, 'not integer'],
    ]

    invalidSeriesIdCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const seriesId = value;
            const seasonId = 1;
            const response = await server
                .put(`${endpoint}/${seriesId}/seasons/${seasonId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    const invalidSeasonIdCases = [
        [400, 'seasonId', 'notANumber', 'not a number'],
        [400, 'seasonId', -1, 'negative number'],
        [400, 'seasonId', 1.5, 'not integer'],
    ]

    invalidSeasonIdCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const seriesId = 1;
            const seasonId = value;
            const response = await server
                .put(`${endpoint}/${seriesId}/seasons/${seasonId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return 201 when adding a season to seen content', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 1;
        const seasonId = 1;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].seasons.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].seasonId).toBe(seasonId);
        let seasonEpisodes = testSeason01.episodes.map((episode) => episode.episode_number);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(seasonId);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId)
            .toBe(seasonEpisodes.reduce((a, b) => Math.max(a, b)));
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(seasonEpisodes.length);
        expect(seenContentList.series[0].seasons[0].episodes.length).toBe(seasonEpisodes.length);
        seenContentList.series[0].seasons[0].episodes.forEach((episode) => {
            expect(seasonEpisodes).toContain(episode.episodeId);
            seasonEpisodes = seasonEpisodes.filter((id) => id !== episode.episodeId);
        });
        expect(seasonEpisodes.length).toBe(0);
    });

    it('should add the remaining episodes to seen content when adding a season to seen content', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 1;
        const seasonId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, 1);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seasons.length).toBe(1);
        let seasonEpisodes = testSeason01.episodes.map((episode) => episode.episode_number);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(seasonId);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId)
            .toBe(seasonEpisodes.reduce((a, b) => Math.max(a, b)));
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(seasonEpisodes.length);
        expect(seenContentList.series[0].seasons[0].episodes.length).toBe(seasonEpisodes.length);
        seenContentList.series[0].seasons[0].episodes.forEach((episode) => {
            expect(seasonEpisodes).toContain(episode.episodeId);
            seasonEpisodes = seasonEpisodes.filter((id) => id !== episode.episodeId);
        });
        expect(seasonEpisodes.length).toBe(0);
    });

    it('should add the special season but totalWatchedEpisodes should be 0', async () => {
        mockGetSeasonDetails.mockReturnValue(testSpecialSeason01)
        const userId = 1;
        const seriesId = 1;
        const seasonId = 0;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seasons.length).toBe(1);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(0);
        let seasonEpisodes = testSpecialSeason01.episodes.map((episode) => episode.episode_number);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(undefined);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(undefined);
        expect(seenContentList.series[0].seasons[0].episodes.length).toBe(seasonEpisodes.length);
        seenContentList.series[0].seasons[0].episodes.forEach((episode) => {
            expect(seasonEpisodes).toContain(episode.episodeId);
            seasonEpisodes = seasonEpisodes.filter((id) => id !== episode.episodeId);
        });
    });

    it('should add the special season but not modify the last episode watched', async () => {
        mockGetSeasonDetails.mockReturnValue(testSpecialSeason01)
        const userId = 1;
        const seriesId = 1;
        const seasonId = 0;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, 1, 1);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seasons.length).toBe(2);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(1);
    });

});
