import { validateContentType } from "@utils";
import Joi from "joi";

export class GetContentReviewDto {
    contentId: number;
    contentType: string;
}

export const GetContentReviewSchema = Joi.object({
    contentId: Joi.number().required().integer().min(1),
    contentType: Joi.string().custom(validateContentType).required(),

});
