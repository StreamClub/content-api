import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { SeenContentService } from '@services';

export class SeenContentController {
    private seenContentService: SeenContentService;

    public constructor(dependencies: AppDependencies) {
        this.seenContentService = new SeenContentService(dependencies);
    }

    public async create(req: Request<any>, res: Response<any>) {
        const userId = res.locals.userId;
        return await this.seenContentService.create(userId);
    }
}
