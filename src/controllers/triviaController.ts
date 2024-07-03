import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { TriviaService } from '@services';

export class TriviaController {
    private triviaService: TriviaService;

    public constructor(dependencies: AppDependencies) {
        this.triviaService = new TriviaService(dependencies);
    }

    public async getTrivias(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.triviaService.getTrivias(userId);
    }

}
