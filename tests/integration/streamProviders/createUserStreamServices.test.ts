/// <reference types="@types/jest" />;
/**
* @group streamProviders
*/

import { generateTestJwt } from '../../helpers';
import { createStreamProvidersList } from '../../helpers/streamProviderHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/streamProviders';

describe('Create User\'s Stream Services List', () => {
    setupBeforeAndAfter();

    it('should create an empty Stream Service List when provided with a token of a new user', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(userId);
        expect(response.body.providerId).toEqual([]);
    });
});
