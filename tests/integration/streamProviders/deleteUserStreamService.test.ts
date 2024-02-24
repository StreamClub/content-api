/// <reference types="@types/jest" />;
/**
* @group streamProviders
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { generateTestJwt, testStreamServices01 } from '../../helpers';
import { addStreamProvider, createStreamProvidersList } from '../../helpers/streamProviderHelper';
import { mockGetStreamServices } from '../../setup/mocksSetUp';

const endpoint = '/streamProviders';

describe('Remove User\'s Stream Services', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'providerId', 'notANumber', 'not a number'],
        [400, 'providerId', -1, 'negative number'],
        [400, 'providerId', 0, 'zero'],
        [400, 'providerId', 1.5, 'not integer'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const providerId = value;
            const response = await server.delete(`${endpoint}`)
                .send({ providerId })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return 404 when trying to remove a service of a user without service list', async () => {
        const userId = 1;
        const providerId = 2;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.delete(`${endpoint}`)
            .send({ providerId })
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });

    it('should remove a service of the user', async () => {
        mockGetStreamServices.mockReturnValue(testStreamServices01);
        const userId = 1;
        const providerId = 2;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createStreamProvidersList(userId);
        await addStreamProvider(userId, providerId);
        const response = await server.delete(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ providerId });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`)
            .query({ country: 'AR' })
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(0);
    });

    it('should respond 200 and do nothing if the content is not in the watchlist', async () => {
        mockGetStreamServices.mockReturnValue(testStreamServices01);
        const userId = 1;
        const providerId = 2;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createStreamProvidersList(userId);
        const response = await server.delete(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ providerId });
        expect(response.status).toBe(200);
        const getResponse = await server.get(`${endpoint}/${userId}`)
            .query({ country: 'AR' })
            .set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(0);
    });

});
