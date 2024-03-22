import { reviewRepository } from "@dal";
import { AddReviewDto } from "@dtos";
import { Review } from "@entities";
import AppDependencies from "appDependencies";

export class ReviewService {
    public constructor(dependencies: AppDependencies) {
    }

    public async addReview(userId: number, review: AddReviewDto) {
        return await reviewRepository.addReview(userId, review);
    }

    public async getReviewsByUserId(userId: number) {
        return await reviewRepository.getReviewsByUserId(userId);
    }
}
