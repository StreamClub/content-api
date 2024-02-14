import { SeenContent, SeenEpisode, SeenSeason } from '@entities';
import { SeenContentModel } from './seenContentModel'
import { SPECIALS_SEASON_ID } from '@config';

class SeenContentRepository {

    async create(userId: string): Promise<SeenContent> {
        const seenContent = new SeenContentModel({ userId });
        await seenContent.save();
        return new SeenContent(seenContent);
    }

    async get(userId: string): Promise<SeenContent> {
        return await SeenContentModel.findOne({ userId });
    }

    async addMovie(userId: string, movieId: Number): Promise<void> {
        await SeenContentModel.updateOne(
            {
                userId,
                'movies': {
                    $not: { $elemMatch: { movieId } }
                },
            },
            {
                $push: {
                    movies: {
                        $each: [{ movieId }],
                        $position: 0
                    }
                }
            },
        );
    }

    async removeMovie(userId: string, movieId: Number): Promise<void> {
        await SeenContentModel.updateOne(
            {
                userId,
                'movies': { $elemMatch: { movieId } }
            },
            {
                $pull: { movies: { movieId } }
            },
        );
    }

    async isASeenMovie(userId: string, movieId: Number): Promise<boolean> {
        const seenContent = await SeenContentModel.findOne({
            userId,
            'movies': { $elemMatch: { movieId } }
        });
        return !!seenContent;
    }

    private async incrementTotalWatchedEpisodes(userId: string, seriesId: number, seasonId: number, quantity = 1) {
        if (seasonId != SPECIALS_SEASON_ID) {
            await SeenContentModel.updateOne(
                { userId, 'series.seriesId': seriesId },
                {
                    $inc: {
                        'series.$.totalWatchedEpisodes': quantity
                    }
                }
            );
        }
    }

    public async addSeries(userId: string, seriesId: number, seenSeasons: SeenSeason[]) {
        const seasonsData = seenSeasons.map(seenSeason => ({
            'seasonId': seenSeason.seasonId,
            'episodes': seenSeason.episodes.map(seenEpisode => ({ 'episodeId': seenEpisode.episodeId })),
        }));

        const totalWatchedEpisodes = seasonsData.reduce((total, season) => {
            if (season.seasonId !== SPECIALS_SEASON_ID) {
                return total + season.episodes.length;
            }
            return total;
        }, 0);

        await SeenContentModel.updateOne(
            { userId, 'series.seriesId': { $ne: seriesId } },
            {
                $push: {
                    'series': {
                        'seriesId': seriesId,
                        'seasons': seasonsData,
                        'totalWatchedEpisodes': totalWatchedEpisodes
                    }
                }
            }
        );
    }

    public async removeSeries(userId: string, seriesId: number) {
        await SeenContentModel.updateOne(
            { userId, 'series.seriesId': seriesId },
            {
                $pull: { 'series': { seriesId } }
            }
        );
    }

    public async addNewSeason(userId: string, seriesId: number, seasonId: number, seenEpisodes: SeenEpisode[]) {
        const result = await SeenContentModel.updateOne(
            {
                userId,
                'series.seriesId': seriesId,
                'series.seasons.seasonId': { $ne: seasonId },
            },
            {
                $push: {
                    'series.$.seasons': {
                        seasonId,
                        'episodes': seenEpisodes.map(seenEpisode => ({ 'episodeId': seenEpisode.episodeId })),
                    }
                }
            }
        );
        if (result.modifiedCount > 0) {
            await this.incrementTotalWatchedEpisodes(userId, seriesId, seasonId, seenEpisodes.length);
        }
    }

    public async addToSeason(userId: string, seriesId: number, seasonId: number, seenEpisodes: SeenEpisode[]) {
        const result = await SeenContentModel.updateOne(
            {
                userId,
                'series.seriesId': seriesId,
                'series.seasons.seasonId': seasonId,
            },
            {
                $push: {
                    'series.$.seasons.$[season].episodes': {
                        $each: seenEpisodes.map(seenEpisode => ({ 'episodeId': seenEpisode.episodeId })),
                    }
                }
            },
            {
                arrayFilters: [{ 'season.seasonId': seasonId }]
            }
        );
        if (result.modifiedCount > 0) {
            await this.incrementTotalWatchedEpisodes(userId, seriesId, seasonId, seenEpisodes.length);
        }
    }

    public async removeSeason(userId: string, seriesId: number, seasonId: number, seasonEpisodesCount: number) {
        const result = await SeenContentModel.updateOne(
            { userId, 'series.seriesId': seriesId, 'series.seasons.seasonId': seasonId },
            {
                $pull: { 'series.$.seasons': { seasonId } }
            }
        );
        if (result.modifiedCount > 0) {
            await this.incrementTotalWatchedEpisodes(userId, seriesId, seasonId, -seasonEpisodesCount);
        }
    }

    public async addEpisode(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        const result = await SeenContentModel.updateOne(
            {
                userId,
                'series.seriesId': seriesId,
                'series.seasons.seasonId': seasonId,
                'series.seasons.episodes.episodeId': { $ne: episodeId }
            },
            {
                $push: {
                    'series.$.seasons.$[season].episodes': {
                        'episodeId': episodeId,
                    }
                }
            },
            {
                arrayFilters: [{ 'season.seasonId': seasonId }]
            }
        );
        if (result.modifiedCount > 0) {
            await this.incrementTotalWatchedEpisodes(userId, seriesId, seasonId);
        }
    }

    public async removeEpisode(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        const result = await SeenContentModel.updateOne(
            {
                userId,
                'series.seriesId': seriesId,
                'series.seasons.seasonId': seasonId,
                'series.seasons.episodes.episodeId': episodeId
            },
            {
                $pull: { 'series.$.seasons.$[season].episodes': { episodeId } }
            },
            {
                arrayFilters: [{ 'season.seasonId': seasonId }]
            }
        );
        if (result.modifiedCount > 0) {
            await this.incrementTotalWatchedEpisodes(userId, seriesId, seasonId, -1);
        }
    }

    public async addLastSeenEpisode(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        if (seasonId !== SPECIALS_SEASON_ID) {
            await SeenContentModel.updateOne(
                { userId, 'series.seriesId': seriesId },
                {
                    $set: {
                        'series.$.lastSeenEpisode': {
                            seasonId,
                            episodeId
                        }
                    }
                }
            );
        }
    }

    public async getLastSeenEpisode(userId: string, seriesId: number): Promise<SeenEpisode> {
        const seenContent = await SeenContentModel.findOne({ userId, 'series.seriesId': seriesId });
        if (seenContent) {
            const series = seenContent.series.find(series => series.seriesId === seriesId);
            if (series && series.lastSeenEpisode.seasonId) {
                return {
                    seasonId: series.lastSeenEpisode.seasonId,
                    episodeId: series.lastSeenEpisode.episodeId
                };
            }
        }
        return null;
    }

    public async getTotalWatchedEpisodes(userId: string, seriesId: number): Promise<number> {
        const result = await SeenContentModel.aggregate([
            { $match: { userId, 'series.seriesId': seriesId } },
            { $unwind: '$series' },
            { $match: { 'series.seriesId': seriesId } },
            { $project: { _id: 0, totalWatchedEpisodes: '$series.totalWatchedEpisodes' } }
        ]);
        return result.length > 0 ? result[0].totalWatchedEpisodes : 0;
    }

    public async getSeenEpisodes(userId: string, seriesId: number, seasonId: number): Promise<number[]> {
        const result = await SeenContentModel.aggregate([
            { $match: { userId, 'series.seriesId': seriesId } },
            { $unwind: '$series' },
            { $match: { 'series.seriesId': seriesId } },
            { $unwind: '$series.seasons' },
            { $match: { 'series.seasons.seasonId': seasonId } },
            { $project: { _id: 0, episodes: '$series.seasons.episodes.episodeId' } }
        ]);
        return result.length > 0 ? result[0].episodes : [];
    }

}

export const seenContentRepository = new SeenContentRepository();
