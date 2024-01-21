/// <reference types="@types/jest" />;
/**
* @group watchlist
*/

import { generateTestJwt } from '../../helpers';
import { createWatchlist } from '../../helpers/watchlistHelper';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

const endpoint = '/watchlist';

describe('Create Watchlist', () => {
    setupBeforeAndAfter();

    it('should return 201 when provided with a token of a new user with no watchlist', async () => {
        const testJwt = generateTestJwt(1, "test@test.com");
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
    });

    it('should return 409 when provided with a token of a new user with a watchlist', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createWatchlist(userId);
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(409);
    });
});
