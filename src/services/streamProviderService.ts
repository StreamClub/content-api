import { streamProviderRepository } from "@dal";
import { Platform } from "@entities";
import AppDependencies from "appDependencies";

export class StreamProviderService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const providers = await streamProviderRepository.doesUserHaveProviderList(userId);
        if (providers) {
            return;
        }
        return await streamProviderRepository.create(userId);
    }

    public async get(userId: number, pageSize: number, pageNumber: number, streamServices: Platform[]) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.get(userId, pageNumber, pageSize, streamServices);
    }

    public async getAll(userId: number) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.getAll(userId);
    }

    public async doesUserHaveOneOf(userId: number, providers: number[]) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.doesUserHaveOneOf(userId, providers);
    }

    public async addProvider(userId: number, providerId: number) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.addProvider(userId, providerId);
    }

    public async deleteProvider(userId: number, providerId: number) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.deleteProvider(userId, providerId);
    }

    public async addWatchedTime(userId: number, watchedTime: number, providerIds: number[]) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.addWatchedTime(userId, watchedTime / 60, providerIds);
    }

    private async failIfWatchlistDoesNotExist(userId: number) {
        const streamProvidersList = await streamProviderRepository.doesUserHaveProviderList(userId);
        if (!streamProvidersList) {
            await this.create(userId);
        }
    }

}