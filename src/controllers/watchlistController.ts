
import { AddContentDto, GetWatchlistDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { AlreadyExistsException, NotFoundException } from '@exceptions';
import { Watchlist } from '@entities';
import { WatchlistRepository } from '@dal';

export class WatchlistController {
    private watchlistRepository: WatchlistRepository;

    public constructor(dependencies: AppDependencies) {
        this.watchlistRepository = new WatchlistRepository();
    }

    public async create(req: Request<GetWatchlistDto>, res: Response<any>) {
        const userId = res.locals.userId;
        const watchlist = await this.watchlistRepository.get(userId);
        if (watchlist) {
            throw new AlreadyExistsException('Watchlist already exists');
        }
        return await this.watchlistRepository.create(userId);
    }

    public async get(req: Request<GetWatchlistDto>) {
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        const foundWatchlist = await this.failIfWatchlistDoesNotExist(req.params.userId);
        const watchlist = new Watchlist(foundWatchlist);
        const totalResults = watchlist.watchlist.length;
        const totalPages = Math.ceil(totalResults / pageSize);
        watchlist.watchlist = watchlist.watchlist.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
        return {
            userId: watchlist.userId,
            results: watchlist.watchlist,
            totalResults,
            totalPages,
        };
    }

    public async addContent(req: Request<AddContentDto>, res: Response<any>) {
        const userId = res.locals.userId;
        await this.failIfWatchlistDoesNotExist(userId);
        return await this.watchlistRepository.addContent(userId, req.body.contentId, req.body.contentType);
    }

    public async removeContent(req: Request<AddContentDto>, res: Response<any>) {
        const userId = res.locals.userId;
        await this.failIfWatchlistDoesNotExist(userId);
        return await this.watchlistRepository.removeContent(userId, req.body.contentId, req.body.contentType);
    }

    private async failIfWatchlistDoesNotExist(userId: string) {
        const watchlist = await this.watchlistRepository.get(userId);
        if (!watchlist) {
            throw new NotFoundException('Watchlist does not exist');
        }
        return watchlist;
    }
}
