import { Review } from "@entities";
import { ReviewModel } from "./reviewModel";

class ReviewRepository {
    async addReview(review: Review): Promise<void> {
        await ReviewModel.findOneAndUpdate(
            {
                userId: review.userId,
                contentId: review.contentId,
                contentType: review.contentType
            },
            review,
            { upsert: true }
        );
    }

}

export const reviewRepository = new ReviewRepository();
