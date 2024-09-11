import { Page, SeenContent, SeenContentResume, SeenEpisode, SeenItemFactory, SeenSeason } from '@entities';
import { SeenContentModel } from './seenContentModel'
import { contentTypes, SPECIALS_SEASON_ID } from '@config';

class SeenContentRepository {

    async create(userId: number): Promise<SeenContent> {
        const seenContent = new SeenContentModel({ userId });
        await seenContent.save();
        return new SeenContent(seenContent);
    }

    async getAll(pageSize: number, pageNumber: number): Promise<any> {
        // internal method, should not care about privacy settings
        const oneMovieOrSeries = {
            $or: [
                { 'movies': { $exists: true, $not: { $size: 0 } } },
                { 'series': { $exists: true, $not: { $size: 0 } } }
            ]
        }
        const seenContents = await SeenContentModel.find(
            oneMovieOrSeries,
            { userId: 1, 'movies.movieId': 1, 'series.seriesId': 1 },
            {
                sort: { userId: 1 },
                skip: (pageNumber - 1) * pageSize,
                limit: pageSize
            }
        )
        const totalItems = await SeenContentModel.countDocuments(oneMovieOrSeries);
        const items = seenContents.map(seenContent => new SeenContentResume(seenContent));
        return new Page(pageNumber, pageSize, totalItems, items)
    }

    async get(userId: number): Promise<SeenContent> {
        return await SeenContentModel.findOne({ userId });
    }

    async getContentList(userId: number, pageSize: number, pageNumber: number, contentTypes: string[]): Promise<Page> {
        const seenContent = await SeenContentModel.aggregate([
            { $match: { userId: userId } },
            {
                $project: {
                    contentType: { $literal: 'movie' },
                    content: {
                        $map: {
                            input: "$movies.movieId",
                            as: "id",
                            in: {
                                id: "$$id",
                                updatedAt: {
                                    $arrayElemAt: [
                                        "$movies.updatedAt",
                                        { $indexOfArray: ["$movies.movieId", "$$id"] }
                                    ]
                                },
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    contentType: 1,
                    content: 1,
                }
            },
            {
                $unionWith: {
                    coll: 'seencontents',
                    pipeline: [
                        { $match: { userId: userId } },
                        {
                            $project: {
                                contentType: { $literal: 'series' },
                                content: {
                                    $map: {
                                        input: "$series.seriesId",
                                        as: "id",
                                        in: {
                                            id: "$$id",
                                            updatedAt: {
                                                $arrayElemAt: [
                                                    "$series.updatedAt",
                                                    { $indexOfArray: ["$series.seriesId", "$$id"] }
                                                ]
                                            },
                                            totalWatchedEpisodes: {
                                                $arrayElemAt: [
                                                    "$series.totalWatchedEpisodes",
                                                    { $indexOfArray: ["$series.seriesId", "$$id"] }
                                                ]
                                            },
                                            lastSeenEpisode: {
                                                $arrayElemAt: [
                                                    "$series.lastSeenEpisode",
                                                    { $indexOfArray: ["$series.seriesId", "$$id"] }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    contentType: { $in: contentTypes }
                }
            },
            { $unwind: "$content" },
            { $sort: { "content.updatedAt": -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize }
        ]);
        const items = seenContent.map((content) => {
            return SeenItemFactory.create(content.contentType, content.content);
        });
        const totalItems = await this.getSeenContentSize(userId, contentTypes);
        return new Page(pageNumber, pageSize, totalItems, items);

    }

    async getSeenContentSize(userId: number, types: string[]): Promise<number> {
        let add = [];
        for (const type of types) {
            if (type == contentTypes.MOVIE) {
                add.push({ $size: "$movies" });
            } else if (type == contentTypes.SERIES) {
                add.push({ $size: "$series" });
            }
        }
        const result = await SeenContentModel.aggregate([
            { $match: { userId: userId } },
            {
                $project: {
                    totalSize: {
                        $add: add
                    }
                }
            }
        ]);
        return result[0] ? result[0].totalSize : 0;
    }


    async addMovie(userId: number, movieId: Number): Promise<void> {
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

    async removeMovie(userId: number, movieId: Number): Promise<void> {
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

    async isASeenMovie(userId: number, movieId: Number): Promise<boolean> {
        const seenContent = await SeenContentModel.findOne({
            userId,
            'movies': { $elemMatch: { movieId } }
        });
        return !!seenContent;
    }

    private async incrementTotalWatchedEpisodes(userId: number, seriesId: number, seasonId: number, quantity = 1) {
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

    public async addSeries(userId: number, seriesId: number, seenSeasons: SeenSeason[]) {
        const seasonsData = seenSeasons.map(seenSeason => ({
            'seasonId': seenSeason.seasonId,
            'episodes': seenSeason.episodes.map(seenEpisode => ({
                'episodeId': seenEpisode.episodeId,
                'createdAt': new Date(), 'updatedAt': new Date()
            })),
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

    public async removeSeries(userId: number, seriesId: number) {
        await SeenContentModel.updateOne(
            { userId, 'series.seriesId': seriesId },
            {
                $pull: { 'series': { seriesId } }
            }
        );
    }

    public async addNewSeason(userId: number, seriesId: number, seasonId: number, seenEpisodes: SeenEpisode[]) {
        const result = await SeenContentModel.updateOne(
            {
                userId,
                'series.seriesId': seriesId,
                'series.seasons': {
                    $elemMatch: {
                        seasonId: { $ne: seasonId }
                    }
                }
            },
            {
                $push: {
                    'series.$.seasons': {
                        seasonId,
                        'episodes': seenEpisodes.map(seenEpisode => ({
                            'episodeId': seenEpisode.episodeId,
                            'createdAt': new Date(), 'updatedAt': new Date()
                        })),
                    }
                }
            }
        );
        if (result.modifiedCount > 0) {
            await this.incrementTotalWatchedEpisodes(userId, seriesId, seasonId, seenEpisodes.length);
        }
    }

    public async addToSeason(userId: number, seriesId: number, seasonId: number, seenEpisodes: SeenEpisode[]) {
        const result = await SeenContentModel.updateOne(
            {
                userId,
                'series.seriesId': seriesId,
                'series.seasons.seasonId': seasonId,
            },
            {
                $push: {
                    'series.$.seasons.$[season].episodes': {
                        $each: seenEpisodes.map(seenEpisode => ({
                            'episodeId': seenEpisode.episodeId,
                            'createdAt': new Date(), 'updatedAt': new Date()
                        })),
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

    public async removeSeason(userId: number, seriesId: number, seasonId: number, seasonEpisodesCount: number) {
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

    public async addEpisode(userId: number, seriesId: number, seasonId: number, episodeId: number) {
        const result = await SeenContentModel.updateOne(
            {
                userId,
                'series.seriesId': seriesId,
                'series.seasons': {
                    $elemMatch: {
                        seasonId: seasonId,
                        'episodes.episodeId': { $ne: episodeId }
                    }
                }
            },
            {
                $push: {
                    'series.$.seasons.$[season].episodes': {
                        'episodeId': episodeId,
                        'createdAt': new Date(),
                        'updatedAt': new Date()
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

    public async removeEpisode(userId: number, seriesId: number, seasonId: number, episodeId: number) {
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

    public async addLastSeenEpisode(userId: number, seriesId: number, seasonId: number, episodeId: number) {
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

    public async getLastSeenEpisode(userId: number, seriesId: number): Promise<SeenEpisode> {
        const seenContent = await SeenContentModel.findOne({ userId, 'series.seriesId': seriesId });
        if (seenContent) {
            const series = seenContent.series.find(series => series.seriesId === seriesId);
            if (series && series.lastSeenEpisode.seasonId) {
                return {
                    seasonId: series.lastSeenEpisode.seasonId,
                    episodeId: series.lastSeenEpisode.episodeId,
                    runtime: '',
                    createdAt: new Date()
                };
            }
        }
        return null;
    }

    public async getTotalWatchedEpisodes(userId: number, seriesId: number): Promise<number> {
        const result = await SeenContentModel.aggregate([
            { $match: { userId, 'series.seriesId': seriesId } },
            { $unwind: '$series' },
            { $match: { 'series.seriesId': seriesId } },
            { $project: { _id: 0, totalWatchedEpisodes: '$series.totalWatchedEpisodes' } }
        ]);
        return result.length > 0 ? result[0].totalWatchedEpisodes : 0;
    }

    public async getSeenEpisodes(userId: number, seriesId: number, seasonId: number): Promise<number[]> {
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

    public async isASeenEpisode(userId: number, seriesId: number, seasonId: number, episodeId: number): Promise<boolean> {
        const seenContent = await SeenContentModel.findOne({
            userId,
            'series.seriesId': seriesId,
            'series.seasons.seasonId': seasonId,
            'series.seasons.episodes.episodeId': episodeId
        });
        return !!seenContent;
    }

    public async getMovieSeenDate(userId: number, movieId: number) {
        const seenContent = await SeenContentModel.findOne({
            userId,
            'movies.movieId': movieId
        });
        if (seenContent) {
            const movie = seenContent.movies.find(movie => movie.movieId === movieId);
            return movie.createdAt;
        }
        return null;
    }

    public async getFriendsRecommendations(userId: number, friendsIds: number[], contentType: string): Promise<number[]> {
        const contentId = contentType === 'movie' ? 'movieId' : 'seriesId';
        const type = contentType === 'movie' ? 'movies' : 'series';
        const query = [
            {
                $match: {
                    userId: { $in: friendsIds },
                },
            },
            {
                $project: {
                    _id: 0,
                    contentIds: `$${type}.${contentId}`,
                },
            },
            {
                $unwind: '$contentIds',
            },
            {
                $group: {
                    _id: 1,
                    allContentIds: { $addToSet: '$contentIds' },
                },
            },
            {
                $lookup: {
                    from: 'seencontents',
                    let: { userId: userId },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
                        {
                            $project: {
                                _id: 0,
                                userContentIds: `$${type}.${contentId}`,
                            },
                        },
                    ],
                    as: 'userContent',
                },
            },
            {
                $unwind: {
                    path: '$userContent',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    friendContentIds: '$allContentIds',
                    userContentIds: { $ifNull: ['$userContent.userContentIds', [] as number[]] },
                },
            },
            {
                $project: {
                    contentNotSeenByUser: {
                        $setDifference: ['$friendContentIds', '$userContentIds'],
                    },
                },
            },
        ];

        const result = await SeenContentModel.aggregate(query);
        return result.length > 0 ? result[0].contentNotSeenByUser : [];
    }

    public async getEpisodeSeenDate(userId: number, seriesId: number, seasonId: number, episodeId: number) {
        const seenContent = await SeenContentModel.findOne({
            userId,
            'series.seriesId': seriesId,
            'series.seasons.seasonId': seasonId,
            'series.seasons.episodes.episodeId': episodeId
        });
        if (seenContent) {
            const series = seenContent.series.find(series => series.seriesId === seriesId);
            const season = series.seasons.find(season => season.seasonId === seasonId);
            const episode = season.episodes.find(episode => episode.episodeId === episodeId);
            return episode?.createdAt ? episode.createdAt : null;
        }
        return null;
    }

}

export const seenContentRepository = new SeenContentRepository();
