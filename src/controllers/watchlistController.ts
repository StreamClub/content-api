import { AddContentDto, GetContentListDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { TmdbService, WatchlistService } from '@services';
import { WatchlistItem, WatchlistItemResume } from '@entities';

export class WatchlistController {
    private watchlistService: WatchlistService;
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.watchlistService = new WatchlistService(dependencies);
        this.tmdbService = new TmdbService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.watchlistService.create(userId);
    }

    public async get(req: Request<GetContentListDto>) {
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        const userId = Number(req.params.userId);
        const userContent = await this.watchlistService.get(userId, pageSize, pageNumber);
        userContent.results = await Promise.all(userContent.results.map(async (content: WatchlistItem) => {
            const { poster, title } = await this.tmdbService.getNameAndPoster(content.contentType, content.id);
            return new WatchlistItemResume(content, poster, title);
        }));
        return userContent;
    }

    public async addContent(req: Request<AddContentDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.watchlistService.addContent(userId, req.body.contentId, req.body.contentType);
    }

    public async removeContent(req: Request<AddContentDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.watchlistService.removeContent(userId, req.body.contentId, req.body.contentType);
    }

    public async getPrivacy(req: Request<any>) {
        const userId = Number(req.params.userId);
        return await this.watchlistService.getPrivacy(userId);
    }
}
