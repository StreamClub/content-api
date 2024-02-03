import { AddContentDto, GetWatchlistDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { WatchlistService } from '@services';

export class WatchlistController {
    private watchlistService: WatchlistService;

    public constructor(dependencies: AppDependencies) {
        this.watchlistService = new WatchlistService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        return await this.watchlistService.create(userId);
    }

    public async get(req: Request<GetWatchlistDto>) {
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        const userId = req.params.userId;
        return await this.watchlistService.get(userId, pageSize, pageNumber);
    }

    public async addContent(req: Request<AddContentDto>, res: Response<any>) {
        const userId = res.locals.userId;
        return await this.watchlistService.addContent(userId, req.body.contentId, req.body.contentType);
    }

    public async removeContent(req: Request<AddContentDto>, res: Response<any>) {
        const userId = res.locals.userId;
        return await this.watchlistService.removeContent(userId, req.body.contentId, req.body.contentType);
    }
}
