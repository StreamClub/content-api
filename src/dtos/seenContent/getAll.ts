import { DEFAULT_PAGE, MIN_PAGE } from "@config";
import Joi from "joi";

export class GetAllContentListDto {
    page: number;
}

export const GetAllContentListSchema = Joi.object({
    page: Joi.number().optional().default(DEFAULT_PAGE).min(MIN_PAGE).integer(),
});
