/// <reference types="@types/jest" />;
/**
* @group streamServices
*/

import { generateTestJwt } from '../../helpers';
import { createStreamProvidersList } from '../../helpers/streamProviderHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/streamServices';

describe('Create User\'s Stream Services List', () => {
    setupBeforeAndAfter();

    it('should create an empty Stream Service List when provided with a token of a new user', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(userId);
        expect(response.body.providerIds).toEqual([]);
    });

    it('should return 409 when provided with a token of a new user with a Stream Service List', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createStreamProvidersList(userId);
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(409);
    });
});
