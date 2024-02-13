/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import { generateTestJwt, testSeason01, testSeason02, testSeries02, testSpecialSeason01 } from '../../helpers';
import { createSeenContentList, getSeenContentList, seeEpisode } from '../../helpers/seenContentHelper';
import { mockGetSeasonDetails, mockGetShowDetails } from '../../setup/mocksSetUp';
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
            const episodeId = 1;
            const response = await server
                .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
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
            const episodeId = 1;
            const response = await server
                .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    const invalidEpisodeIdCases = [
        [400, 'episodeId', 'notANumber', 'not a number'],
        [400, 'episodeId', -1, 'negative number'],
        [400, 'episodeId', 0, 'zero'],
        [400, 'episodeId', 1.5, 'not integer'],
    ]

    invalidEpisodeIdCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const seriesId = 1;
            const seasonId = 1;
            const episodeId = value;
            const response = await server
                .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return 404 when trying to add an episode to of a user without seen list', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(404);
    });

    it('should add an episode to an empty seen list of the user', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201)
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.userId).toBe(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(1);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(seasonId);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(episodeId);
        expect(seenContentList.series[0].seasons.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].seasonId).toBe(seasonId);
        expect(seenContentList.series[0].seasons[0].episodes.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].episodes[0].episodeId).toBe(episodeId);
    });

    it('should not add an episode to the seen list of the user if it is already there', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201)
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.userId).toBe(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(1);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(seasonId);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(episodeId);
        expect(seenContentList.series[0].seasons.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].seasonId).toBe(seasonId);
        expect(seenContentList.series[0].seasons[0].episodes.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].episodes[0].episodeId).toBe(episodeId);
    });

    it('should add an episode to a seen list with an episode of that season', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId + 1}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201)
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.userId).toBe(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(2);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(seasonId);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(episodeId + 1);
        expect(seenContentList.series[0].seasons.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].seasonId).toBe(seasonId);
        expect(seenContentList.series[0].seasons[0].episodes.length).toBe(2);
        let expectedEpisodes = [episodeId, episodeId + 1];
        seenContentList.series[0].seasons[0].episodes.forEach((episode) => {
            expect(expectedEpisodes).toContain(episode.episodeId);
            expectedEpisodes = expectedEpisodes.filter((id) => id !== episode.episodeId);
        })
    });

    it('should add an episode ta a seen list with an episode of another season', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId + 1}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201)
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.userId).toBe(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(2);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(seasonId + 1);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(episodeId);
        expect(seenContentList.series[0].seasons.length).toBe(2);
        expect(seenContentList.series[0].seasons[0].seasonId).toBe(seasonId);
        seenContentList.series[0].seasons.forEach((season) => {
            if (season.seasonId === seasonId) {
                expect(season.episodes.length).toBe(1);
                expect(season.episodes[0].episodeId).toBe(episodeId);
            } else {
                expect(season.seasonId).toBe(seasonId + 1);
                expect(season.episodes.length).toBe(1);
                expect(season.episodes[0].episodeId).toBe(episodeId);
            }
        });
    });

    it('should add an episode of an special season but should not increment the total watched episodes', async () => {
        mockGetSeasonDetails.mockReturnValue(testSpecialSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 0;
        const episodeId = 1;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201)
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.userId).toBe(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(0);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(undefined);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(undefined);
        expect(seenContentList.series[0].seasons.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].seasonId).toBe(seasonId);
        expect(seenContentList.series[0].seasons[0].episodes.length).toBe(1);
        expect(seenContentList.series[0].seasons[0].episodes[0].episodeId).toBe(episodeId);
    });

    it('should not modify the next episode if a special episode is watched', async () => {
        mockGetSeasonDetails.mockReturnValue(testSpecialSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 0;
        const episodeId = 1;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        await seeEpisode(userId, seriesId, seasonId + 1, episodeId + 1);
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(201)
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.userId).toBe(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(1);
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(seasonId + 1);
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(episodeId +1 );
        expect(seenContentList.series[0].seasons.length).toBe(2);
    });

    it('should return an error if the episode has not aired', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason02)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 22;
        const episodeId = 1095;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`)
        expect(response.status).toBe(409);
    });
});
