import { streamProviderRepository } from "@dal";
import { Platform } from "@entities";
import AppDependencies from "appDependencies";

export class StreamProviderService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const providers = await streamProviderRepository.doesUserHaveWatchlist(userId);
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

    private async failIfWatchlistDoesNotExist(userId: number) {
        const streamProvidersList = await streamProviderRepository.doesUserHaveWatchlist(userId);
        if (!streamProvidersList) {
            await this.create(userId);
        }
    }

}