import { reviewRepository } from "@dal";
import { Review } from "@entities";
import AppDependencies from "appDependencies";

export class ReviewService {
    public constructor(dependencies: AppDependencies) {
    }

    public async addReview(review: Review) {
        return await reviewRepository.addReview(review);
    }
}
