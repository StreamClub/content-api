import { privacyRepository } from "@dal";
import AppDependencies from "appDependencies";

export class PrivacyService {
    public constructor(dependencies: AppDependencies) {
    }

    public async getPrivacy(userId: number) {
        return await privacyRepository.get(userId);
    }

    // public async updatePrivacy(userId: number, isWatchlistPrivate: boolean) {
    //     return await privacyRepository.updateWatchlistPrivacy(userId, isWatchlistPrivate);
    // }

}
