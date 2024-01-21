
import { AddMovieDto, GetWatchlistDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request } from '@models';
import WatchlistRepository from '@dal/watchlist/watchlistRepository';
import { AlreadyExistsException, NotFoundException } from '@exceptions';
import { Watchlist } from '@entities';

export class WatchlistController {
    private watchlistRepository: WatchlistRepository;

    public constructor(dependencies: AppDependencies) {
        this.watchlistRepository = new WatchlistRepository();
    }

    public async create(req: Request<GetWatchlistDto>) {
        const watchlist = await this.watchlistRepository.get(req.body.userId);
        if (watchlist) {
            throw new AlreadyExistsException('Watchlist already exists');
        }
        return await this.watchlistRepository.create(req.body.userId);
    }

    public async get(req: Request<GetWatchlistDto>) {
        const watchlist = await this.failIfWatchlistDoesNotExist(req.params.userId);
        return new Watchlist(watchlist);
    }

    public async addContent(req: Request<AddMovieDto>) {
        await this.failIfWatchlistDoesNotExist(req.params.userId);
        return await this.watchlistRepository.addContent(req.params.userId, req.body.contentId, req.body.contentType);
    }

    private async failIfWatchlistDoesNotExist(userId: string) {
        const watchlist = await this.watchlistRepository.get(userId);
        if (!watchlist) {
            throw new NotFoundException('Watchlist does not exist');
        }
        return watchlist;
    }
}
