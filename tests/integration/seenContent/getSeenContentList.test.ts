/// <reference types="@types/jest" />;
/**
* @group seenContent
*/

import { generateTestJwt } from '../../helpers';
import { createSeenContentList } from '../../helpers/seenContentHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent';

describe('Get Seen Content List', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'page', 'notANumber', 'not a number'],
        [400, 'page', 1.5, 'not an integer'],
        [400, 'page', -1, 'negative'],
        [400, 'page', 0, 'zero'],
        [400, 'pageSize', 'notANumber', 'not a number'],
        [400, 'pageSize', 1.5, 'not an integer'],
        [400, 'pageSize', -1, 'negative'],
        [400, 'pageSize', 0, 'zero'],
        [400, 'pageSize', 21, 'greater than 20'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const response = await server.get(`${endpoint}/${1}`)
                .query({ [field]: value })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    const invalidPathCases = [
        [400, 'userId', 'notANumber', 'not a number'],
        [400, 'userId', 1.5, 'not an integer'],
        [400, 'userId', -1, 'negative'],
        [400, 'userId', 0, 'zero'],
    ]

    invalidPathCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const response = await server.get(`${endpoint}/${value}`)
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return an empty seen content list when provided asked for a new content list', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createSeenContentList(userId);
        const response = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body.results).toEqual([]);
        expect(response.body.page).toBe(1);
        expect(response.body.totalPages).toBe(0);
        expect(response.body.totalResults).toBe(0);
    });

    it('should return 404 when provided with an id of a user with no Seen Content List', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });
});
