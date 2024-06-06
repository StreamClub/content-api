import { Privacy } from '@entities'
import { PrivacyModel } from './privacyModel';

class PrivacyRepository {
    async create(userId: number, isWatchlistPrivate: boolean = false): Promise<Privacy> {
        const privacy = new PrivacyModel({ userId, isWatchlistPrivate });
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

    private async find(userId: number): Promise<PrivacyModel> {
        return await PrivacyModel.findOne({ userId })
    }

    async update(userId: number, isWatchlistPrivate: boolean): Promise<Privacy> {
        const founded = await this.find(userId);

        founded.isWatchlistPrivate = isWatchlistPrivate;
        await founded.save();

    }
}

export const privacyRepository = new PrivacyRepository();
