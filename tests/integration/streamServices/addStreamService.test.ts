/// <reference types="@types/jest" />;
/**
* @group streamServices
*/
import { generateTestJwt, testStreamServices01 } from '../../helpers';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockGetStreamServices } from '../../setup/mocksSetUp';
import { createStreamProvidersList } from '../../helpers/streamProviderHelper';

const endpoint = '/streamServices';

describe('Add Stream Provider To User', () => {
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
            const response = await server.put(`${endpoint}`)
                .send({ providerId })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return 404 when trying to add a provider to a user without Stream Provider List', async () => {
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ providerId: 2150 });
        expect(response.status).toBe(404);
    });

    it('should add a stream provider to the user', async () => {
        mockGetStreamServices.mockReturnValue(testStreamServices01);
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createStreamProvidersList(userId);
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ providerId: 1, });
        expect(response.status).toBe(201);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].providerId).toBe(1);
    });

    it('should not add a Stream Provider Twice to the user', async () => {
        mockGetStreamServices.mockReturnValue(testStreamServices01);
        const userId = 1;
        const providerId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createStreamProvidersList(userId);
        const response = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ providerId });
        expect(response.status).toBe(201);
        const response2 = await server.put(`${endpoint}`)
            .set('Authorization', `Bearer ${testJwt}`)
            .send({ providerId });
        expect(response2.status).toBe(201);
        const getResponse = await server.get(`${endpoint}/${userId}`).set('Authorization', `Bearer ${testJwt}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results.length).toBe(1);
        expect(getResponse.body.results[0].providerId).toBe(providerId);
    });
});
