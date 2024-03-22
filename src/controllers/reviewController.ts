import {
    AddReviewDto, DeleteReviewDto, GetContentListDto,
    GetMovieReviewDto, GetSeriesReviewDto
} from '@dtos';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { ReviewService } from '@services';
import { contentTypes } from '@config';

export class ReviewController {
    private reviewService: ReviewService;

    public constructor(dependencies: AppDependencies) {
        this.reviewService = new ReviewService(dependencies);
    }

    public async addReview(req: Request<AddReviewDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.reviewService.addReview(userId, req.body);
    }

    public async deleteReview(req: Request<DeleteReviewDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        return await this.reviewService.deleteReview(userId, req.body);
    }

    public async getReviewsByUserId(req: Request<GetContentListDto>, res: Response<any>) {
        const userId = Number(req.params.userId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        return await this.reviewService.getReviewsByUserId(userId, pageNumber, pageSize);
    }

    public async getReviewsByMovieId(req: Request<GetMovieReviewDto>, res: Response<any>) {
        const contentId = Number(req.params.movieId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        return await this.reviewService.getReviewsByContent(contentId, contentTypes.MOVIE,
            pageNumber, pageSize);
    }

    public async getReviewsBySeriesId(req: Request<GetSeriesReviewDto>, res: Response<any>) {
        const contentId = Number(req.params.seriesId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        return await this.reviewService.getReviewsByContent(contentId, contentTypes.SERIES,
            pageNumber, pageSize);
    }
}
