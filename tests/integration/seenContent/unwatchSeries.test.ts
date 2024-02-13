/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import { generateTestJwt, testProviders01, testSeason01, testSeason02, testSeries02 } from '../../helpers';
import { createSeenContentList, getSeenContentList, seeEpisode } from '../../helpers/seenContentHelper';
import { mockGetRedirectLinks, mockGetSeasonDetails, mockGetShowDetails } from '../../setup/mocksSetUp';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent/series';

describe('Remove Series from Seen Content List', () => {
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
            const response = await server
                .delete(`${endpoint}/${seriesId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should delete a whole series from the seen content list', async () => {
        mockGetShowDetails.mockReturnValue(testSeries02);
        mockGetRedirectLinks.mockReturnValue(testProviders01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason02);
        const userId = 1;
        const seriesId = 37854;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const putResponse = await server
            .put(`${endpoint}/${seriesId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(putResponse.status).toBe(201);
        const response = await server
            .delete(`${endpoint}/${seriesId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const seenContent = await getSeenContentList(userId);
        expect(seenContent.series).toHaveLength(0);
    });

    it('should return ok when trying to delete a series that is not in the seen content list', async () => {
        const userId = 1;
        const seriesId = 37854;
        await createSeenContentList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .delete(`${endpoint}/${seriesId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
    });
});
