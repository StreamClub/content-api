/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import { generateTestJwt } from '../../helpers';
import { createSeenContentList, getSeenContentList, seeEpisode } from '../../helpers/seenContentHelper';
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
                .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
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
                .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
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
                .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should delete an episode from the seen content list', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series[0].seasons[0].episodes).toHaveLength(0);
        expect(seenContent.series[0].totalWatchedEpisodes).toBe(0);
    });

    it('should return ok when trying to delete an episode that is not in the seen content list', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
    });

    it('should delete just the specified episode from the season', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        await seeEpisode(userId, seriesId, seasonId, episodeId + 1);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series[0].seasons[0].episodes).toHaveLength(1);
        expect(seenContent.series[0].totalWatchedEpisodes).toBe(1);
        expect(seenContent.series[0].seasons[0].episodes[0].episodeId).toBe(episodeId + 1);
    });
    
    it('should delete the episode from the specified season', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        await seeEpisode(userId, seriesId, seasonId + 1, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series[0].totalWatchedEpisodes).toBe(1);
        seenContent.series[0].seasons.forEach(season => {
            if (season.seasonId === seasonId) {
                expect(season.episodes).toHaveLength(0);
            } else {
                expect(season.episodes).toHaveLength(1);
            }
        });
    });

    it('should delete an episode from the special season and totalWatchedEpisodes should be 0', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 0;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series[0].seasons[0].episodes).toHaveLength(0);
        expect(seenContent.series[0].totalWatchedEpisodes).toBe(0);
    });

    it('should delete an episode from the special season and totalWatchedEpisodes not change', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 0;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        await seeEpisode(userId, seriesId, seasonId + 1, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series[0].seasons[0].episodes).toHaveLength(0);
        expect(seenContent.series[0].totalWatchedEpisodes).toBe(1);
    });
});
