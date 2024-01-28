
import { GetMovieDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';

export class SeriesController {
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
    }

    public async searchSeries(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = res.locals.userId;
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string || '1');
        return await this.tmdbService.searchSeries(userId, query, page);
    }

}
