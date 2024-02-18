/// <reference types="@types/jest" />;
/**
* @group streamServices
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { generateTestJwt, testStreamServices01 } from '../../helpers';
import { mockGetStreamServices } from '../../setup/mocksSetUp';

const endpoint = '/streamServices';

describe('Get Stream Services', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'country', '', 'empty'],
        [400, 'country', 'notACode', 'too long'],
        [400, 'country', 'a', 'too short'],
        [400, 'country', 'ar', 'lowercase'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com")
            const response = await
                server.get(`${endpoint}`).query({ [field]: value }).set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return a stream service list when provided with a valid country code', async () => {
        mockGetStreamServices.mockReturnValue(testStreamServices01)
        const testJwt = generateTestJwt(1, "test@test.com")
        const country = 'AR';
        const response = await
            server.get(`${endpoint}`).query({ country }).set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        expect(response.body.streamServices).toBeDefined();
        expect(response.body.streamServices.length).toBeGreaterThan(0);
        response.body.streamServices.forEach((service: any) => {
            expect(service.providerId).toBeDefined();
            expect(service.providerName).toBeDefined();
            expect(service.logoPath).toBeDefined();
            expect(service.displayPriority).toBeDefined();
        });
    });

});
