/// <reference types="@types/jest" />;
/**
* @group streamServices
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { generateTestJwt, testStreamServices01 } from '../../helpers';
import { createStreamProvidersList } from '../../helpers/streamProviderHelper';
import { mockGetStreamServices } from '../../setup/mocksSetUp';

const endpoint = '/streamServices';

describe('Get User\'s Stream Services', () => {
    setupBeforeAndAfter();

    const invalidPathCases = [
        [400, 'userId', 'notANumber', 'not a number'],
        [400, 'userId', -1, 'negative number'],
        [400, 'userId', 0, 'zero'],
        [400, 'userId', 1.5, 'not integer'],

    ]

    invalidPathCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const response = await server.get(`${endpoint}/${value}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

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

    it('should return an empty stream providers list when provided asked for a new list', async () => {
        mockGetStreamServices.mockReturnValue(testStreamServices01);
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createStreamProvidersList(userId);
        const response = await server.get(`${endpoint}/${userId}`)
            .query({ country: 'AR' })
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        expect(response.body.results).toEqual([]);
        expect(response.body.page).toBe(1);
        expect(response.body.totalPages).toBe(0);
        expect(response.body.totalResults).toBe(0);
    });

    it('should return 404 when provided with an id of a user with no stream providers list', async () => {
        mockGetStreamServices.mockReturnValue(testStreamServices01);
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.get(`${endpoint}/${userId}`)
            .query({ country: 'AR' })
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });
});
