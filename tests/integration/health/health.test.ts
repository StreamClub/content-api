/// <reference types="@types/jest" />;
/**
* @group health
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';

describe('Health', () => {
    setupBeforeAndAfter();
    it('should return 200', async () => {
        const response = await server.get('/health');
        expect(response.status).toBe(200);
    });
});
