/// <reference types="@types/jest" />;
/**
* @group artists
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockGetArtistDetails } from '../../setup/mocksSetUp';
import { generateTestJwt, testMovie1 } from '../../helpers';

const endpoint = '/artists';

describe('Get Artist', () => {
    setupBeforeAndAfter();

    it('should return a 404 if the movie does not exist', async () => {
        mockGetArtistDetails.mockRejectedValue({ response: { status: 404 } });
        const testJwt = generateTestJwt(1, "test@test.com")
        const artistId = 0;
        const response = await server.get(`${endpoint}/${artistId}`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });

    it('should return an Actor with the correct format', async () => {

        const testJwt = generateTestJwt(1, "test@test.com")
        const id = 2150;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country }).set('Authorization', `Bearer ${testJwt}`);
        const actor = response.body;
        expect(actor.id).toBeDefined();
        expect(actor.poster).toBeDefined();
        expect(actor.birthDate).toBeDefined();
        expect(actor.birthPlace).toBeDefined();
        expect(actor.deathDate).toBeDefined();
        expect(actor.gender).toBeDefined();
    });

});
