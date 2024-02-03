
import { GetArtistDto, SearchContentDto } from '@dtos';
import { TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';

export class ArtistController {
    private tmdbService: TmdbService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
    }

    public async searchArtist(req: Request<SearchContentDto>, res: Response<any>) {
        const userId = res.locals.userId;
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string || '1');
        return await this.tmdbService.searchArtist(userId, query, page);
    }

    public async getArtist(req: Request<GetArtistDto>) {
        return await this.tmdbService.getArtist(req.params.artistId);
    }

}
