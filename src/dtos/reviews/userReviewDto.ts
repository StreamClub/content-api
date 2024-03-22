import Joi from "joi";

export class UserReviewDto {
    userId: number;
}

export const UserReviewSchema = Joi.object({
    userId: Joi.number().required().integer().min(1),
});
