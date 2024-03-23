import { MAX_REVIEW_LENGTH } from "@config";
import { validateContentType } from "@utils";
import Joi from "joi";

export class AddReviewDto {
    contentId: number;
    liked: boolean;
    review: string;
    contentType: string;
}

export const AddReviewSchema = Joi.object({
    contentId: Joi.number().required().integer().min(1),
    liked: Joi.boolean().required(),
    review: Joi.string().optional().max(MAX_REVIEW_LENGTH),
    contentType: Joi.string().custom(validateContentType).required(),
});
