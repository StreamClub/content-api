import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { TmdbService, TriviaService } from '@services';

export class TriviaController {
    private triviaService: TriviaService;
    private tmdbService: TmdbService;

    constructor(dependencies: AppDependencies) {
        this.triviaService = new TriviaService(dependencies);
        this.tmdbService = new TmdbService(dependencies);
    }

    public async getTrivias(req: Request<any>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const trivias = await this.triviaService.getTrivias(userId);
        const promises = trivias.map(async (trivia) => {
            const content = await this.tmdbService.getTriviaContent(trivia.contentId, trivia.contentType);
            trivia.setContentInfo(content.title, content.poster);
        });
        await Promise.all(promises);
        return trivias

    }

}
