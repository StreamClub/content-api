
import { AddContentDto, GetWatchlistDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { AlreadyExistsException, NotFoundException } from '@exceptions';
import { Watchlist } from '@entities';
import WatchlistRepository from '@dal/watchlist/watchlistRepository';

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
        const watchlist = await this.failIfWatchlistDoesNotExist(req.params.userId);
        return new Watchlist(watchlist);
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
