import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { PrivacyService } from '@services';

export class PrivacyController {
    private privacyService: PrivacyService;

    public constructor(dependencies: AppDependencies) {
        this.privacyService = new PrivacyService(dependencies);
    }

    public async getPrivacy(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.privacyService.getPrivacy(userId);
    }

    public async updateWatchlistPrivacy(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.privacyService.updateWatchlistPrivacy(userId, req.body.isWatchlistPrivate);
    }

    public async updateSeenContentPrivacy(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.privacyService.updateSeenContentPrivacy(userId, req.body.isSeenContentListPrivate);
    }

}
