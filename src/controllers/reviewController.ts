import { AddReviewDto, DeleteReviewDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { ReviewService } from '@services';

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

    public async getReviewsByUserId(req: Request<any>, res: Response<any>) {
        const userId = Number(req.params.userId);
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.page) || 1;
        return await this.reviewService.getReviewsByUserId(userId, pageNumber, pageSize);
    }
}
