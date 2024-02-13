/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import { generateTestJwt, testSeason01 } from '../../helpers';
import { createSeenContentList, getSeenContentList, seeEpisode } from '../../helpers/seenContentHelper';
import { mockGetSeasonDetails } from '../../setup/mocksSetUp';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent/series';

describe('Remove Season From Seen Content List', () => {
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
                .delete(`${endpoint}/${seriesId}/seasons/${seasonId}`)
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
                .delete(`${endpoint}/${seriesId}/seasons/${seasonId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should delete a whole season from the seen content list', async () => {
        mockGetSeasonDetails.mockReturnValue(testSeason01)
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const putResponse = await server
            .put(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(putResponse.status).toBe(201);
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series[0].seasons).toHaveLength(0);
        expect(seenContent.series[0].totalWatchedEpisodes).toBe(0);
    });

    it('should return ok when trying to delete a season that is not in the seen content list', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 1;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
    });

    it('should delete a season from the special season and totalWatchedEpisodes should not be affected', async () => {
        const userId = 1;
        const seriesId = 37854;
        const seasonId = 0;
        const episodeId = 1;
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, seasonId + 1, episodeId);
        await seeEpisode(userId, seriesId, seasonId, episodeId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}/seasons/${seasonId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series[0].seasons).toHaveLength(1);
        expect(seenContent.series[0].seasons.length).toBe(1);
    });
});
