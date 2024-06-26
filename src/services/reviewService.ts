import { reviewRepository } from "@dal";
import { AddReviewDto, DeleteReviewDto } from "@dtos";
import AppDependencies from "appDependencies";

export class ReviewService {
    public constructor(dependencies: AppDependencies) {
    }

    public async addReview(userId: number, review: AddReviewDto) {
        return await reviewRepository.addReview(userId, review);
    }

    public async deleteReview(userId: number, review: DeleteReviewDto) {
        return await reviewRepository.deleteReview(userId, review);
    }

    public async getReviewsByUserId(userId: number, page: number, pageSize: number) {
        return await reviewRepository.getReviewsByUserId(userId, page, pageSize);
    }

    public async getReviewsByContent(contentId: number, contentType: string, page: number, pageSize: number) {
        return await reviewRepository.getReviewsByContent(contentId, contentType, page, pageSize);
    }

    public async getReview(userId: number, contentId: number, contentType: string) {
        return await reviewRepository.getReview(userId, contentId, contentType);
    }
}
