import { privacyRepository } from "@dal";
import AppDependencies from "appDependencies";

export class PrivacyService {
    public constructor(dependencies: AppDependencies) {
    }

    public async getPrivacy(userId: number) {
        return await privacyRepository.get(userId);
    }

    public async updateWatchlistPrivacy(userId: number, isWatchlistPrivate: boolean) {
        return await privacyRepository.updateWatchlistPrivacy(userId, isWatchlistPrivate);
    }

    public async updateSeenContentPrivacy(userId: number, isSeenContentListPrivate: boolean) {
        return await privacyRepository.updateSeenContentListPrivacy(userId, isSeenContentListPrivate);
    }

    public async filterIdsWithSeenContentListPublic(ids: number[]) {
        return await privacyRepository.filterIdsWithSeenContentListPublic(ids);
    }

}
