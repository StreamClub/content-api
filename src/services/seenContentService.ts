import { privacyRepository, seenContentRepository } from "@dal";
import {
    Page, SeasonEpisode, SeenContent, SeenEpisode,
    SeenMovie,
    SeenSeason, SeenSeries
} from "@entities";
import AppDependencies from "appDependencies";

export class SeenContentService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const seenContent = await seenContentRepository.get(userId);
        if (seenContent) {
            return;
        }
        return await seenContentRepository.create(userId);
    }

    public async getAll(pageSize: number, pageNumber: number) {
        return await seenContentRepository.getAll(pageSize, pageNumber);
    }

    public async getSeenContent(userId: number, pageSize: number, pageNumber: number, requesterId: number, contentTypes: string[]) {
        await this.createIfListDoesNotExist(userId);
        const isOwner = userId === requesterId;
        const userPrivacy = await privacyRepository.get(userId);
        if (!isOwner && userPrivacy.isSeenContentListPrivate) {
            const page = new Page(1, pageSize, 0, []);
            page.isPublic = !userPrivacy.isSeenContentListPrivate;
            return page;
        }
        const page = await seenContentRepository.getContentList(userId, pageSize, pageNumber, contentTypes);
        page.isPublic = !userPrivacy.isSeenContentListPrivate;
        return page;
    }

    //TODO: eliminar este método
    public async getMovies(userId: number, pageSize: number, pageNumber: number) {
        const found = await this.createIfListDoesNotExist(userId);
        const seenMovies = found.movies.map((movie) => new SeenMovie(movie));
        const results = seenMovies.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
        return new Page(pageNumber, pageSize, seenMovies.length, results);
    }

    public async addMovie(userId: number, movieId: number) {
        await this.createIfListDoesNotExist(userId);
        await seenContentRepository.addMovie(userId, movieId);
    }

    public async removeMovie(userId: number, movieId: number) {
        await this.createIfListDoesNotExist(userId);
        await seenContentRepository.removeMovie(userId, movieId);
    }

    public async addSeries(userId: number, seriesId: number, seasons: SeenSeason[], latestSeenEpisode: SeasonEpisode) {
        const seenContent = await this.createIfListDoesNotExist(userId);
        await this.addSeasons(userId, seriesId, seasons, seenContent.series.find(series => series.seriesId === seriesId));
        await seenContentRepository.addLastSeenEpisode(userId, seriesId,
            latestSeenEpisode.seasonId, latestSeenEpisode.episodeId);
    }

    public async removeSeries(userId: number, seriesId: number) {
        await this.createIfListDoesNotExist(userId);
        await seenContentRepository.removeSeries(userId, seriesId);
    }

    private async addSeasons(userId: number, seriesId: number, seasons: SeenSeason[], seenSeries: SeenSeries) {

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

    public async addSeason(userId: number, seriesId: number, series: SeenSeries, seenSeason: SeenSeason, latestSeenEpisode: SeasonEpisode) {
        if (latestSeenEpisode) {
            await this.addSeasons(userId, seriesId, [seenSeason], series);
            await seenContentRepository.addLastSeenEpisode(userId, seriesId,
                latestSeenEpisode.seasonId, latestSeenEpisode.episodeId);
        }
    }

    public async removeSeason(userId: number, seriesId: number, seasonId: number) {
        const seenContent: SeenContent = await this.createIfListDoesNotExist(userId);
        const season = seenContent.series.find(series => series.seriesId === seriesId)
            ?.seasons.find(season => season.seasonId === seasonId);
        if (season) {
            await seenContentRepository.removeSeason(userId, seriesId, seasonId, season.episodes.length);
        }
    }

    public async addEpisode(userId: number, seriesId: number, seasonId: number, episodeId: number) {
        const seenContent = await this.createIfListDoesNotExist(userId);
        const seenEpisodes: SeenEpisode[] = [{ seasonId, episodeId, runtime: '', createdAt: new Date() }];
        const series = seenContent.series.find(series => series.seriesId === seriesId);

        if (!series) {
            const seenSeasons = [new SeenSeason(seasonId, seenEpisodes)];
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

    public async removeEpisode(userId: number, seriesId: number, seasonId: number, episodeId: number) {
        await this.createIfListDoesNotExist(userId);
        await seenContentRepository.removeEpisode(userId, seriesId, seasonId, episodeId);
    }

    public async getMovieSeenDate(userId: number, movieId: number) {
        await this.createIfListDoesNotExist(userId);
        return await seenContentRepository.getMovieSeenDate(userId, movieId);
    }

    public async getEpisodeSeenDate(userId: number, seriesId: number, seasonId: number, episodeId: number) {
        await this.createIfListDoesNotExist(userId);
        return await seenContentRepository.getEpisodeSeenDate(userId, seriesId, seasonId, episodeId);
    }

    public async isASeenMovie(userId: number, movieId: number) {
        await this.createIfListDoesNotExist(userId);
        return await seenContentRepository.isASeenMovie(userId, movieId);
    }

    public async isASeenEpisode(userId: number, seriesId: number, seasonId: number, episodeId: number) {
        await this.createIfListDoesNotExist(userId);
        return await seenContentRepository.isASeenEpisode(userId, seriesId, seasonId, episodeId);
    }

    public async getTotalWatchedEpisodes(userId: number, seriesId: number) {
        await this.createIfListDoesNotExist(userId);
        return await seenContentRepository.getTotalWatchedEpisodes(userId, seriesId);
    }

    public async getLastSeenEpisode(userId: number, seriesId: number) {
        await this.createIfListDoesNotExist(userId);
        return await seenContentRepository.getLastSeenEpisode(userId, seriesId);
    }

    public async getSeenEpisodes(userId: number, seriesId: number, seasonId: number) {
        await this.createIfListDoesNotExist(userId);
        return await seenContentRepository.getSeenEpisodes(userId, seriesId, seasonId);
    }

    public async getSeenContentList(userId: number) {
        return await this.createIfListDoesNotExist(userId);
    }

    public async getFriendsRecommendations(userId: number, friendsIds: number[], contentType: string) {
        await this.createIfListDoesNotExist(userId);
        const recommendations = await seenContentRepository.getFriendsRecommendations(userId, friendsIds, contentType);
        recommendations.sort(() => Math.random() - 0.5);
        recommendations.splice(5);
        return { recommendations };
    }

    private async createIfListDoesNotExist(userId: number) {
        const seenContent = await seenContentRepository.get(userId);
        if (!seenContent) {
            await this.create(userId);
        }
        return seenContent;
    }

}
