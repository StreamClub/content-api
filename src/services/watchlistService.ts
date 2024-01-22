import { Watchlist } from "@entities";
import { watchlistRepository } from "@dal";
import { AlreadyExistsException, NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";

export class WatchlistService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: string) {
        const watchlist = await watchlistRepository.get(userId);
        if (watchlist) {
            throw new AlreadyExistsException('Watchlist already exists');
        }
        return await watchlistRepository.create(userId);
    }

    public async get(userId: string, pageSize: number, pageNumber: number) {
        const foundWatchlist = await this.failIfWatchlistDoesNotExist(userId);
        const watchlist = new Watchlist(foundWatchlist);
        const totalResults = watchlist.watchlist.length;
        const totalPages = Math.ceil(totalResults / pageSize);
        watchlist.watchlist = watchlist.watchlist.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
        return {
            userId: watchlist.userId,
            results: watchlist.watchlist,
            page: pageNumber,
            totalResults,
            totalPages,
        };
    }

    public async addContent(userId: string, contentId: string, contentType: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.addContent(userId, contentId, contentType);
    }

    public async removeContent(userId: string, contentId: string, contentType: string) {
        await this.failIfWatchlistDoesNotExist(userId);
        return await watchlistRepository.removeContent(userId, contentId, contentType);
    }

    private async failIfWatchlistDoesNotExist(userId: string) {
        const watchlist = await watchlistRepository.get(userId);
        if (!watchlist) {
            throw new NotFoundException('Watchlist does not exist');
        }
        return watchlist;
    }

}
