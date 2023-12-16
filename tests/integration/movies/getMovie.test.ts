/// <reference types="@types/jest" />;
/**
* @group movies
*/

import { mockMovieInfo, server, setupBeforeAndAfter } from '../../setup/testsSetup';
import { testMovie1 } from '../../helpers';
import { Movie } from '@entities';

const endpoint = '/movies';

describe('Get Movie', () => {
    setupBeforeAndAfter();

    const invalidQueryCases = [
        [400, 'country', '', 'empty'],
        [400, 'country', 'notACode', 'too long'],
        [400, 'country', 'a', 'too short'],
        [400, 'country', 'ar', 'lowercase'],
    ]

    invalidQueryCases.forEach(([status, field, value, description]) => {
        it(`should return ${status} when provided with an ${description} ${field}`, async () => {
            const id = 2150;
            const response = await server.get(`${endpoint}/${id}`).query({ [field]: value });
            expect(response.status).toBe(status);
        });
    });

    it('should return a Movie with the correct format', async () => {
        mockMovieInfo.mockReturnValue(testMovie1);
        const id = 2150;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country });
        const movie = response.body as Movie;
        expect(response.status).toBe(200);
        expect(movie.id).toBe(testMovie1.id);
        expect(movie.title).toBe(testMovie1.title);
        expect(movie.overview).toBe(testMovie1.overview);
        expect(movie.poster).toBe(testMovie1.poster_path);
        expect(movie.backdrop).toBe(testMovie1.backdrop_path);
        expect(movie.releaseDate).toBe(testMovie1.release_date);
        expect(movie.genres).toStrictEqual(testMovie1.genres.map((genre) => genre.name));
        expect(movie.runtime).toBe(testMovie1.runtime);
        expect(movie.budget).toBe(testMovie1.budget);
        expect(movie.revenue).toBe(testMovie1.revenue);
        expect(movie.status).toBe(testMovie1.status);
        expect(movie.platforms.length).toBeGreaterThanOrEqual(1);
        expect(movie.cast.length).toBeLessThanOrEqual(10);
        expect(movie.similar.length).toBeLessThanOrEqual(10);
        for (const trailer of movie.trailers) {
            expect(trailer.site).toBe('YouTube');
            expect(trailer.type).toBe('Trailer');
        }
    });

    it('should return a 404 if the movie does not exist', async () => {
        mockMovieInfo.mockRejectedValue({ response: { status: 404 } });
        const id = 0;
        const country = 'AR';
        const response = await server.get(`${endpoint}/${id}`)
            .query({ country });
        expect(response.status).toBe(404);
    });
});
