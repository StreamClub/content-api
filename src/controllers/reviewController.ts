import { AddReviewDto } from '@dtos';
import AppDependencies from 'appDependencies';
import { Request, Response } from '@models';
import { ReviewService } from '@services';
import { Review } from '@entities';

export class ReviewController {
    private reviewService: ReviewService;

    public constructor(dependencies: AppDependencies) {
        this.reviewService = new ReviewService(dependencies);
    }

    public async addReview(req: Request<AddReviewDto>, res: Response<any>) {
        const userId = Number(res.locals.userId);
        const { contentId, contentType, review, liked } = req.body;
        return await this.reviewService.addReview(userId, req.body);
    }

    public async getReviewsByUserId(req: Request<any>, res: Response<any>) {
        const userId = Number(req.params.userId);
        return await this.reviewService.getReviewsByUserId(userId);
    }
}
