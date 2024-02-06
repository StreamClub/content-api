import { SeenContent } from '@entities';
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

    public async addSeries(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        const totalWatchedEpisodes = seasonId === SPECIALS_SEASON_ID ? 1 : 0;
        await SeenContentModel.updateOne(
            { userId, 'series.seriesId': { $ne: seriesId } },
            {
                $push: {
                    'series': {
                        'seriesId': seriesId,
                        'seasons': [{
                            'seasonId': seasonId,
                            'episodes': [{ 'episodeId': episodeId }],
                        }],
                        'totalWatchedEpisodes': totalWatchedEpisodes
                    }
                }
            }
        );
    }

    public async addSeason(userId: string, seriesId: number, seasonId: number, episodeId: number) {
        const result = await SeenContentModel.updateOne(
            { userId, 'series.seriesId': seriesId, 'series.seasons.seasonId': { $ne: seasonId } },
            {
                $push: {
                    'series.$.seasons': {
                        seasonId,
                        'episodes': [{ episodeId }],
                    }
                }
            }
        );

        if (result.modifiedCount > 0) {
            await this.incrementTotalWatchedEpisodes(userId, seriesId, seasonId);
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

}

export const seenContentRepository = new SeenContentRepository();
