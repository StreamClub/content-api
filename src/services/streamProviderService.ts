import { streamProviderRepository } from "@dal";
import { Platform } from "@entities";
import { AlreadyExistsException, NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";

export class StreamProviderService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const providers = await streamProviderRepository.doesUserHaveWatchlist(userId);
        if (providers) {
            throw new AlreadyExistsException('Stream Provider List already exists');
        }
        return await streamProviderRepository.create(userId);
    }

    public async get(userId: number, pageSize: number, pageNumber: number, streamServices: Platform[]) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.get(userId, pageNumber, pageSize, streamServices);
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
        const watchlist = await streamProviderRepository.doesUserHaveWatchlist(userId);
        if (!watchlist) {
            throw new NotFoundException('Stream Provider List does not exist');
        }
    }

}