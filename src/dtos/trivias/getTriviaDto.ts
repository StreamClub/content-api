import { contentTypes } from "@config";
import Joi from "joi";

export class GetTriviaDto {
    contentId: number;
    contentType: string;
}

export const GetTriviaSchema = Joi.object({
    contentId: Joi.number().required().integer().positive(),
    contentType: Joi.string().required().valid(...Object.values(contentTypes)),
});
