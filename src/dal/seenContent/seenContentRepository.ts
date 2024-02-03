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

}

export const seenContentRepository = new SeenContentRepository();
