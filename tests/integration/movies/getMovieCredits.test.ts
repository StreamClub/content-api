/// <reference types="@types/jest" />;
/**
* @group movies
*/

import { server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { mockGetMovieCredits } from '../../setup/mocksSetUp';
import { generateTestJwt, testMovie1 } from '../../helpers';
import { createStreamProvidersList } from '../../helpers/streamProviderHelper';

const endpoint = '/movies';

describe('Get Movie Credits', () => {
    setupBeforeAndAfter();

    const invalidParamsCases = [
        [400, 'movieId', '-1', 'negative'],
        [400, 'movieId', 'notANumber', 'not a number'],
        [400, 'movieId', '1.5', 'not an integer'],
        [400, 'movieId', '', 'empty'],
    ]

    invalidParamsCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const testJwt = generateTestJwt(1, "test@test.com")
            const id = value;
            const response = await
                server.get(`${endpoint}/${id}/credits`)
                    .set('Authorization', `Bearer ${testJwt}`);
            expect(response.status).toBe(status);
        });
    });

    it('should return movie credits with the correct format', async () => {
        mockGetMovieCredits.mockReturnValue(testMovie1.credits);
        const userId = 1;
        const testJwt = generateTestJwt(userId, "test@test.com");
        await createStreamProvidersList(userId);
        const id = 2150;
        const response = await server.get(`${endpoint}/${id}/credits`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(200);
        const credits = response.body;

        expect(credits.cast).toBeDefined();
        credits.cast.forEach((cast: any) => {
            expect(cast.id).toBeDefined();
            expect(cast.name).toBeDefined();
            expect(cast.character).toBeDefined();
            expect(cast.poster).toBeDefined();
        });

        expect(credits.crew).toBeDefined();
        credits.crew.forEach((crew: any) => {
            expect(crew.id).toBeDefined();
            expect(crew.name).toBeDefined();
            expect(crew.job).toBeDefined();
            expect(crew.poster).toBeDefined();
        });
    });

    it('should return a 404 if the movie does not exist', async () => {
        mockGetMovieCredits.mockRejectedValue({ response: { status: 404 } });
        const testJwt = generateTestJwt(1, "test@test.com")
        const id = 0;
        const response = await server.get(`${endpoint}/${id}/credits`)
            .set('Authorization', `Bearer ${testJwt}`);
        expect(response.status).toBe(404);
    });
});
