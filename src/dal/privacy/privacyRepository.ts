import { Privacy } from '@entities'
import { PrivacyModel } from './privacyModel';

class PrivacyRepository {
    async create(userId: number): Promise<Privacy> {
        const privacy = new PrivacyModel({ userId });
        await privacy.save();
        return new Privacy(privacy);
    }

    async get(userId: number): Promise<Privacy> {
        const founded = await PrivacyModel.findOne({ userId });
        if (!founded) {
            return await this.create(userId);
        }
        return new Privacy(founded);
    }
}

export const privacyRepository = new PrivacyRepository();
