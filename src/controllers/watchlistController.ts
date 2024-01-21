
import { GetWatchlistDto } from '@dtos';
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
        const watchlist = await this.watchlistRepository.get(req.params.userId);
        if (!watchlist) {
            throw new NotFoundException('Watchlist does not exist');
        }
        return new Watchlist(watchlist);
    }

    public async addMovie(req: Request<GetWatchlistDto>) {
        return await this.watchlistRepository.addMovie(req.params.userId, req.params.movieId);
    }
}
