import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { PrivacyService, WatchlistService } from '@services';

export class PrivacyController {
    private watchlistService: WatchlistService;
    private privacyService: PrivacyService;

    public constructor(dependencies: AppDependencies) {
        this.watchlistService = new WatchlistService(dependencies);
        this.privacyService = new PrivacyService(dependencies);
    }

    public async getPrivacy(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.privacyService.getPrivacy(userId);
    }

    // public async updatePrivacy(req: Request<any>, res: Response<any>) {
    //     const userId = Number(res.locals.userId);
    //     return await this.watchlistService.updatePrivacy(userId, req.body.isWatchlistPrivate);
    // }

}
