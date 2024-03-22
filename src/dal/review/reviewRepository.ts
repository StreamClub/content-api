import { Review } from "@entities";
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

    async getReviewsByUserId(userId: number): Promise<Review[]> {
        //TODO: agregar paginación
        const reviews = await ReviewModel.find({ userId });
        return reviews.map((review) => new Review(review));
    }

}

export const reviewRepository = new ReviewRepository();
