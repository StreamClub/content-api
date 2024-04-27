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

    it('should create an empty watchlist when provided with a token of a new user with no watchlist', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.post(endpoint).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(userId);
        expect(response.body.watchlist).toEqual([]);
    });
});
