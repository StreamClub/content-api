import { streamProviderRepository } from "@dal";
import { AlreadyExistsException, NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";

export class StreamProvidersService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const providers = await streamProviderRepository.doesUserHaveWatchlist(userId);
        if (providers) {
            throw new AlreadyExistsException('Watchlist already exists');
        }
        return await streamProviderRepository.create(userId);
    }

    public async get(userId: number, pageSize: number, pageNumber: number) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.get(userId, pageNumber, pageSize);
    }

    public async addProvider(userId: number, providerId: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await streamProviderRepository.addProvider(userId, providerId);
    }

    private async failIfWatchlistDoesNotExist(userId: number) {
        const watchlist = await streamProviderRepository.doesUserHaveWatchlist(userId);
        if (!watchlist) {
            throw new NotFoundException('Stream Provider List does not exist');
        }
    }

}