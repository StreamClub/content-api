/// <reference types="@types/jest" />;
/**
* @group seenContent
*/
import moment from 'moment';
import { generateTestJwt, testProviders01, testSeason01, testSeason02, testSeries02 } from '../../helpers';
import { createSeenContentList, getSeenContentList, seeEpisode } from '../../helpers/seenContentHelper';
import { mockGetRedirectLinks, mockGetSeasonDetails, mockGetShowDetails } from '../../setup/mocksSetUp';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { createStreamProvidersList } from '../../helpers/streamProviderHelper';

const endpoint = '/seenContent/series';

describe('Add Series To Seen Content List', () => {
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
                .put(`${endpoint}/${seriesId}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return 201 when adding a series to seen content', async () => {
        mockGetShowDetails.mockReturnValue(testSeries02);
        mockGetRedirectLinks.mockReturnValue(testProviders01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason02);
        const userId = 1;
        const seriesId = 1;
        await createSeenContentList(userId);
        await createStreamProvidersList(userId);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].seasons.length).toBe(2);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(66);
        let lastEpisode = testSeason02.episodes
            .filter(episode => moment(episode.air_date).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'))
            .map((episode) => episode.episode_number)
            .reduce((a, b) => Math.max(a, b));
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(lastEpisode)
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(testSeason02.season_number)
    });

    it('should add the remaining episodes to seen content when adding a series with a seen episode', async () => {
        mockGetShowDetails.mockReturnValue(testSeries02);
        mockGetRedirectLinks.mockReturnValue(testProviders01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason01);
        mockGetSeasonDetails.mockReturnValueOnce(testSeason02);
        const userId = 1;
        const seriesId = 1;
        await createStreamProvidersList(userId);
        await createSeenContentList(userId);
        await seeEpisode(userId, seriesId, 1, 1);
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server
            .put(`${endpoint}/${seriesId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        const seenContentList = await getSeenContentList(userId);
        expect(seenContentList.series.length).toBe(1);
        expect(seenContentList.series[0].seriesId).toBe(seriesId);
        expect(seenContentList.series[0].seasons.length).toBe(2);
        expect(seenContentList.series[0].totalWatchedEpisodes).toBe(66);
        let lastEpisode = testSeason02.episodes
            .filter(episode => moment(episode.air_date).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'))
            .map((episode) => episode.episode_number)
            .reduce((a, b) => Math.max(a, b));
        expect(seenContentList.series[0].lastSeenEpisode.episodeId).toBe(lastEpisode)
        expect(seenContentList.series[0].lastSeenEpisode.seasonId).toBe(testSeason02.season_number)
    });
});
