import { privacyRepository, watchlistRepository } from "@dal";
import { Page } from "@entities";
import AppDependencies from "appDependencies";

export class WatchlistService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const watchlist = await watchlistRepository.doesUserHaveWatchlist(userId);
        if (watchlist) {
            return;
        }
        return await watchlistRepository.create(userId);
    }

    public async get(userId: number, pageSize: number, pageNumber: number, requesterId: number) {
        const isOwner = userId === requesterId;
        const userPrivacy = await privacyRepository.get(userId);
        if (!isOwner && userPrivacy.isWatchlistPrivate) {
            return new Page(1, pageSize, 0, []);
        }
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.get(userId, pageNumber, pageSize);
    }

    public async addContent(userId: number, contentId: string, contentType: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.addContent(userId, contentId, contentType);
    }

    public async removeContent(userId: number, contentId: string, contentType: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.removeContent(userId, contentId, contentType);
    }

    public async isInWatchlist(userId: number, contentId: string, contentType: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.isInWatchlist(userId, contentId, contentType);
    }

    private async failIfWatchlistDoesNotExist(userId: number) {
        const watchlist = await watchlistRepository.doesUserHaveWatchlist(userId);
        if (!watchlist) {
            await this.create(userId);
        }
    }

}
