import { SeenContent } from '@entities';
import { SeenContentModel } from './seenContentModel'

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

}

export const seenContentRepository = new SeenContentRepository();
