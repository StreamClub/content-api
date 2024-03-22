import { Page, Review } from "@entities";
import { ReviewModel } from "./reviewModel";
import { AddReviewDto, DeleteReviewDto } from "@dtos";

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

    async deleteReview(userId: number, review: DeleteReviewDto): Promise<void> {
        await ReviewModel.findOneAndDelete({
            userId: userId,
            contentId: review.contentId,
            contentType: review.contentType
        });
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

    async getReviewsByContent(contentId: number, contentType: string, page: number, pageSize: number): Promise<Page> {
        console.log(contentId, contentType, page, pageSize)
        const reviews = await ReviewModel.aggregate([
            {
                $match: {
                    contentId,
                    contentType
                },
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize }
        ])
        const amountOfReviews = await this.getContentAmountOfReviews(contentId, contentType);
        const results = reviews.map((review) => new Review(review));
        return new Page(page, pageSize, amountOfReviews, results)
    }

    async getContentAmountOfReviews(contentId: number, contentType: string): Promise<number> {
        return await ReviewModel.countDocuments({ contentId, contentType });
    }

}

export const reviewRepository = new ReviewRepository();
