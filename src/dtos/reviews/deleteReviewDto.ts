import { validateContentType } from "@utils";
import Joi from "joi";

export class DeleteReviewDto {
    contentId: number;
    contentType: string;
}

export const DeleteReviewSchema = Joi.object({
    contentId: Joi.number().required().integer().min(1),
    contentType: Joi.string().custom(validateContentType).required(),
});
