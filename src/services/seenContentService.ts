import { seenContentRepository } from "@dal";
import { Page, SeenContent, SeenMovie, UserContentList } from "@entities";
import { AlreadyExistsException, NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";

export class SeenContentService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: string) {
        const seenContent = await seenContentRepository.get(userId);
        if (seenContent) {
            throw new AlreadyExistsException('Seen Content List already exists');
        }
        return await seenContentRepository.create(userId);
    }

    public async getMovies(userId: string, pageSize: number, pageNumber: number) {
        const found = await this.failIfListDoesNotExist(userId);
        const seenMovies = found.movies.map((movie) => new SeenMovie(movie));
        const page = new Page(pageNumber, pageSize, seenMovies);
        return new UserContentList(userId, page);
    }

    public async addMovie(userId: string, movieId: number) {
        await this.failIfListDoesNotExist(userId);
        await seenContentRepository.addMovie(userId, movieId);
    }

    public async removeMovie(userId: string, movieId: number) {
        await this.failIfListDoesNotExist(userId);
        await seenContentRepository.removeMovie(userId, movieId);
    }

    public async addEpisode(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        const seenContent = await this.failIfListDoesNotExist(userId);
        const series = seenContent.series.find(series => series.seriesId === seriesId);

        if (!series) {
            await seenContentRepository.addSeries(userId, seriesId, seasonId, episodeId);
        } else {
            const seasonIndex = series.seasons.findIndex(season => season.seasonId === seasonId);

            if (seasonIndex === -1) {
                await seenContentRepository.addSeason(userId, seriesId, seasonId, episodeId);
            } else {
                await seenContentRepository.addEpisode(userId, seriesId, seasonId, episodeId);
            }
        }
    }

    public async removeEpisode(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        await this.failIfListDoesNotExist(userId);
        await seenContentRepository.removeEpisode(userId, seriesId, seasonId, episodeId);
    }


    private async failIfListDoesNotExist(userId: string) {
        const seenContent = await seenContentRepository.get(userId);
        if (!seenContent) {
            throw new NotFoundException('Seen Content List does not exist');
        }
        return seenContent;
    }
}
