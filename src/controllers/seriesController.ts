
import { GetContentResumeDto, GetMovieDto } from '@dtos';
import { PrivacyService, SeenContentService, TmdbService } from '@services';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { contentTypes } from '@config';

export class SeriesController {
    private tmdbService: TmdbService;
    private seenContentService: SeenContentService;
    private privacyService: PrivacyService;

    public constructor(dependencies: AppDependencies) {
        this.tmdbService = new TmdbService(dependencies);
        this.seenContentService = new SeenContentService(dependencies);
        this.privacyService = new PrivacyService(dependencies);
    }

    public async searchSeries(req: Request<GetMovieDto>, res: Response<any>) {
        const country = req.query.country as string;
        const userId = Number(res.locals.userId);
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string || '1');
        return await this.tmdbService.searchSeries(userId, query, page, country);
    }

    public async discoverSeries(req: Request<GetMovieDto>, res: Response<any>) {
        const country = req.query.country as string;
        const userId = Number(res.locals.userId);
        const page = parseInt(req.query.page as string || '1');
        const genderIds = (req.query.genderIds ? req.query.genderIds as string : '').split(',');
        const runtimeGte = parseInt(req.query.runtimeGte as string || '0');
        const runtimeLte = parseInt(req.query.runtimeLte as string || '2147483647');
        const inMyPlatforms = req.query.inMyPlatforms === 'true';
        return await this.tmdbService.discoverSeries(userId, page, country, genderIds,
            runtimeGte, runtimeLte, inMyPlatforms);
    }

    public async getSeries(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const country = req.query.country as string;
        const seriesId = Number(req.params.seriesId);
        return await this.tmdbService.getSeries(userId, seriesId, country);
    }

    public async getSeriesResume(req: Request<GetContentResumeDto>, res: Response<any>) {
        const query = (req.query.ids as string).split(',');
        const userId = Number(res.locals.userId);
        const seriesIds = query.map((ids) => Number(ids));
        let series = [];
        for (const id of seriesIds) {
            const seriesResume = await this.tmdbService.getSeriesResume(id, userId);
            if (seriesResume) series.push(seriesResume);
        }
        return series;
    }

    public async getFriendsRecommendations(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const friendsIds = (req.query.friendsIds as string).split(',').map((id: string) => Number(id));
        const filteredFriendsIds = await this.privacyService.filterIdsWithSeenContentListPublic(friendsIds);
        const recommendations = await this.seenContentService
            .getFriendsRecommendations(userId, filteredFriendsIds, contentTypes.SERIES);
        let series = [];
        for (const id of recommendations.recommendations) {
            const serie = await this.tmdbService.getSeriesResume(id, userId);
            if (serie) series.push(serie);
        }
        return { recommendations: series };
    }

    public async getSeason(req: Request<GetMovieDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const seriesId = Number(req.params.seriesId);
        const seasonId = Number(req.params.seasonId);
        return await this.tmdbService.getUserSeason(userId, seriesId, seasonId);
    }

    public async getSeriesCredits(req: Request<GetMovieDto>, res: Response<any>) {
        const seriesId = Number(req.params.seriesId);
        return await this.tmdbService.getContentCredits(seriesId, contentTypes.SERIES);
    }

}
