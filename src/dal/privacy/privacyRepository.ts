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

    async filterIdsWithSeenContentListPublic(ids: number[]): Promise<number[]> {
        const privacies = await PrivacyModel.find({
            userId: { $in: ids },
            isSeenContentListPrivate: false
        });
        return privacies.map((privacy) => privacy.userId);
    }

    async updateWatchlistPrivacy(userId: number, isWatchlistPrivate: boolean): Promise<Privacy> {
        const founded = await PrivacyModel.findOne({ userId });
        if (!founded) {
            return await this.create(userId, isWatchlistPrivate);
        }
        founded.isWatchlistPrivate = isWatchlistPrivate;
        await founded.save();
        return new Privacy(founded);
    }

    async updateSeenContentListPrivacy(userId: number, isSeenContentListPrivate: boolean): Promise<Privacy> {
        const founded = await PrivacyModel.findOne({ userId });
        if (!founded) {
            return await this.create(userId, isSeenContentListPrivate);
        }
        founded.isSeenContentListPrivate = isSeenContentListPrivate;
        await founded.save();
        return new Privacy(founded);
    }
}

export const privacyRepository = new PrivacyRepository();
