
import { GetMovieDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';

export class StreamServiceController {
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
    }

    public async getStreamServices(req: Request<any>, res: Response<any>) {
        const country = req.query.country as string;
        const streamServices = await this.tmdbService.getStreamServices(country);
        return { streamServices };
    }

}
