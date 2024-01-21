
import { GetWatchlistDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request } from '@models';
import WatchlistRepository from '@dal/watchlist/watchlistRepository';
import { AlreadyExistsException } from '@exceptions';

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
}
