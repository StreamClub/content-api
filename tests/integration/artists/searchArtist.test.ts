/// <reference types="@types/jest" />;
/**
* @group artists
*/

import { MAX_STRING_LENGTH } from '@config';
import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { generateTestJwt } from '../../helpers';
import { mockGetArtistDetails, mockSearchArtist } from '../../setup/mocksSetUp';
import { testArtist01, testSearchArtist01 } from '../../helpers/testArtists';

const endpoint = '/artists';

describe('Search Artist', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'query', '', 'empty'],
        [400, 'query', 'a'.repeat(MAX_STRING_LENGTH + 1), 'too long'],
        [400, 'page', '0', 'zero'],
        [400, 'page', '-1', 'negative'],
        [400, 'page', 'notANumber', 'not a number'],
        [400, 'page', '1.5', 'not an integer'],
        [400, 'page', '', 'empty'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com");
            const response = await server.get(`${endpoint}`)
                .query({ [field]: value })
                .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return a list of artists with the correct format', async () => {
        mockSearchArtist.mockReturnValue(testSearchArtist01)
        mockGetArtistDetails.mockReturnValue(testArtist01)
        const query = 'test';
        const testJwt = generateTestJwt(1, "test@test.com");
        const page = 1;
        const response = await server.get(`${endpoint}`)
            .query({ query, page }).set('Authorization', `Bearer ${testJwt}`);
        const actors = response.body.results;
        expect(response.status).toBe(200);
        expect(actors.length).toBeLessThanOrEqual(20);
        for (const actor of actors) {
            expect(actor.id).toBeDefined();
            expect(actor.poster).toBeDefined();
            expect(actor.birthDate).toBeDefined();
            expect(actor.birthPlace).toBeDefined();
            expect(actor.gender).toBeDefined();
        }
        expect(response.body.page).toBeGreaterThanOrEqual(1);
        expect(response.body.totalPages).toBeGreaterThanOrEqual(0);
        expect(response.body.totalResults).toBeGreaterThanOrEqual(0);
    });

});
