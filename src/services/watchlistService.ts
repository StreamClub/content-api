import { Page, UserContentList, Watchlist } from "@entities";
import { watchlistRepository } from "@dal";
import { AlreadyExistsException, NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";

export class WatchlistService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: number) {
        const watchlist = await watchlistRepository.doesUserHaveWatchlist(userId);
        if (watchlist) {
            throw new AlreadyExistsException('Watchlist already exists');
        }
        return await watchlistRepository.create(userId);
    }

    public async get(userId: number, pageSize: number, pageNumber: number) {
        await this.failIfWatchlistDoesNotExist(userId);
        const page = await watchlistRepository.get(userId, pageNumber, pageSize);
        return new UserContentList(userId, page);
    }

    public async addContent(userId: number, contentId: string, contentType: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.addContent(userId, contentId, contentType);
    }

    public async removeContent(userId: number, contentId: string, contentType: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.removeContent(userId, contentId, contentType);
    }

    private async failIfWatchlistDoesNotExist(userId: number) {
        const watchlist = await watchlistRepository.doesUserHaveWatchlist(userId);
        if (!watchlist) {
            throw new NotFoundException('Watchlist does not exist');
        }
    }

}
