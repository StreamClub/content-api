import { seenContentRepository } from "@dal";
import { Page, SeasonEpisode, SeenContent, SeenEpisode, SeenMovie, SeenSeason, SeenSeries, UserContentList } from "@entities";
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

    public async addSeries(userId: string, seriesId: number, seasons: SeenSeason[], latestSeenEpisode: SeasonEpisode) {
        const seenContent = await this.failIfListDoesNotExist(userId);
        await this.addSeasons(userId, seriesId, seasons, seenContent.series.find(series => series.seriesId === seriesId));
        await seenContentRepository.addLastSeenEpisode(userId, seriesId,
            latestSeenEpisode.seasonId, latestSeenEpisode.episodeId);
    }

    public async removeSeries(userId: string, seriesId: number) {
        await this.failIfListDoesNotExist(userId);
        await seenContentRepository.removeSeries(userId, seriesId);
    }

    private async addSeasons(userId: string, seriesId: number, seasons: SeenSeason[], seenSeries: SeenSeries) {

        if (!seenSeries) {
            await seenContentRepository.addSeries(userId, seriesId, seasons);
        } else {
            seasons.forEach(season => {
                const seasonIndex = seenSeries.seasons.findIndex(seenSeason => seenSeason.seasonId === season.seasonId);
                if (seasonIndex === -1) {
                    seenContentRepository.addNewSeason(userId, seriesId, season.seasonId, season.episodes);
                } else {
                    const existingEpisodeIds = seenSeries.seasons[seasonIndex].episodes.map(ep => ep.episodeId);
                    const newEpisodes = season.episodes.filter(episode => !existingEpisodeIds.includes(episode.episodeId));
                    seenContentRepository.addToSeason(userId, seriesId, season.seasonId, newEpisodes);
                }
            });
        }
    }

    public async addSeason(userId: string, seriesId: number, seasonId: number, episodes: SeenEpisode[], latestSeenEpisode: SeasonEpisode) {
        const seenContent = await this.failIfListDoesNotExist(userId);
        const series = seenContent.series.find(series => series.seriesId === seriesId);
        await this.addSeasons(userId, seriesId, [new SeenSeason({ seasonId, episodes })], series);
        await seenContentRepository.addLastSeenEpisode(userId, seriesId,
            latestSeenEpisode.seasonId, latestSeenEpisode.episodeId);
    }

    public async removeSeason(userId: string, seriesId: number, seasonId: number) {
        const seenContent: SeenContent = new SeenContent(await this.failIfListDoesNotExist(userId));
        const season = seenContent.series.find(series => series.seriesId === seriesId)
            ?.seasons.find(season => season.seasonId === seasonId);
        if (season) {
            await seenContentRepository.removeSeason(userId, seriesId, seasonId, season.episodes.length);
        }
    }

    public async addEpisode(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        const seenContent = await this.failIfListDoesNotExist(userId);
        const seenEpisodes: SeenEpisode[] = [{ seasonId, episodeId }];
        const series = seenContent.series.find(series => series.seriesId === seriesId);

        if (!series) {
            const seenSeasons = [new SeenSeason({ seasonId, episodes: seenEpisodes })];
            await seenContentRepository.addSeries(userId, seriesId, seenSeasons);
        } else {
            const seasonIndex = series.seasons.findIndex(season => season.seasonId === seasonId);

            if (seasonIndex === -1) {
                await seenContentRepository.addNewSeason(userId, seriesId, seasonId, seenEpisodes);
            } else {
                await seenContentRepository.addEpisode(userId, seriesId, seasonId, episodeId);
            }
        }
        await seenContentRepository.addLastSeenEpisode(userId, seriesId, seasonId, episodeId);
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
