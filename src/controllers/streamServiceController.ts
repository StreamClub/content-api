import { StreamProvidersService, TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';

export class StreamProvidersController {
    private tmdbService: TmdbService;
    private streamProvidersService: StreamProvidersService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
        this.streamProvidersService = new StreamProvidersService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.streamProvidersService.create(userId);
    }

    public async getStreamProviders(req: Request<any>, res: Response<any>) {
        const country = req.query.country as string;
        const streamServices = await this.tmdbService.getStreamProviders(country);
        return { streamServices };
    }

    public async getUserStreamProviders(req: Request<any>, res: Response<any>) {
        const userId = Number(req.params.userId);
        const country = req.query.country as string;
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        const streamServices = await this.tmdbService.getStreamProviders(country);
        const page = await this.streamProvidersService.get(userId, pageSize, pageNumber, streamServices);
        return page;
    }

    public async addProvider(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const providerId = req.body.providerId;
        return await this.streamProvidersService.addProvider(userId, providerId);
    }

}
