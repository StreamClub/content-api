import { Page, Review } from "@entities";
import { ReviewModel } from "./reviewModel";
import { AddReviewDto } from "@dtos";

class ReviewRepository {
    async addReview(userId: number, review: AddReviewDto): Promise<void> {
        await ReviewModel.findOneAndUpdate(
            {
                userId: userId,
                contentId: review.contentId,
                contentType: review.contentType
            },
            {
                userId: userId,
                ...review

            },
            { upsert: true }
        );
    }

    async getReviewsByUserId(userId: number, page: number, pageSize: number): Promise<Page> {
        const reviews = await ReviewModel.aggregate([
            {
                $match: {
                    userId,
                },
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize }
        ])
        const amountOfReviews = await this.getUsersAmountOfReviews(userId);
        const results = reviews.map((review) => new Review(review));
        return new Page(page, pageSize, amountOfReviews, results)
    }

    async getUsersAmountOfReviews(userId: number): Promise<number> {
        return await ReviewModel.countDocuments({ userId });
    }

}

export const reviewRepository = new ReviewRepository();
