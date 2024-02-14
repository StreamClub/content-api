/// <reference types="@types/jest" />;
/**
* @group seenContent
*/

import { generateTestJwt } from '../../helpers';
import { createSeenContentList } from '../../helpers/seenContentHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/seenContent';

describe('Create Seen Content List', () => {
    setupBeforeAndAfter();

    it('should create an empty Seen Content List when provided with a token of a new user', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(userId);
        expect(response.body.movies).toEqual([]);
        expect(response.body.series).toEqual([]);
    });

    it('should return 409 when provided with a token of a new user with a Seen Content List', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createSeenContentList(userId);
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(409);
    });
});
