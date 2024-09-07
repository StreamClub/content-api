import { StreamProviderService, TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { StreamServiceStats } from '@entities';
import { time } from 'console';

export class StreamProviderController {
    private tmdbService: TmdbService;
    private streamProviderService: StreamProviderService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
        this.streamProviderService = new StreamProviderService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.streamProviderService.create(userId);
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
        const page = await this.streamProviderService.get(userId, pageSize, pageNumber, streamServices);
        return page;
    }

    public async addProvider(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const providerId = Number(req.body.providerId);
        return await this.streamProviderService.addProvider(userId, providerId);
    }

    public async deleteProvider(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const providerId = Number(req.body.providerId);
        return await this.streamProviderService.deleteProvider(userId, providerId);
    }

    public async getStats(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const months = Number(req.query.months) || 1;
        const stats = await this.streamProviderService.getStats(userId, months);
        const providers = await this.tmdbService.getStreamProviders('AR');
        stats.top.map((stat: StreamServiceStats) => {
            const platform = providers.find(provider => provider.providerId === stat.providerId);
            stat.setPlatform(platform);
        });
        const unsubscribeRecommendations = await this.streamProviderService
            .getUnsubscribedRecommendations(stats.servicesStats, stats.timeInPlatforms);
        unsubscribeRecommendations.map((stat: StreamServiceStats) => {
            const platform = providers.find(provider => provider.providerId === stat.providerId);
            stat.setPlatform(platform);
        });
        return {
            top: stats.top,
            timeInPlatforms: stats.timeInPlatforms,
            others: stats.others,
            timeOutsidePlatforms: stats.timeOutsidePlatforms,
            unsubscribeRecommendations
        };
    }

    public async getSubscribeRecommendations(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const friendsIds = (req.query.friendsIds as string).split(',').map((id: string) => Number(id));
        const friendsServices = await Promise.all(friendsIds.map(id => this.streamProviderService.getAll(id)));
        const userServices = await this.streamProviderService.getAll(userId);
        const userProviders = userServices.providerId;
        const recommendations: number[] = [];
        for (const friendServices of friendsServices) {
            for (const providerId of friendServices.providerId) {
                if (!userProviders.includes(providerId) && !recommendations.includes(providerId)) {
                    recommendations.push(providerId);
                }
            }
        }
        const providers = await this.tmdbService.getStreamProviders('AR');
        const recommendationsProviders = recommendations
            .map(providerId => providers.find(provider => provider.providerId === providerId));
        return { recommendations: recommendationsProviders };
    }

}
