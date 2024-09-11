import { contentTypes, DEFAULT_PAGE, MAX_PAGE_SIZE, MIN_PAGE, MIN_PAGE_SIZE } from "@config";
import { validateContentType } from "@utils";
import Joi, { custom } from "joi";

export class GetContentListDto {
    userId: string;
    page: number;
    pageSize: number;
    contentTypes: string[];
}

export const GetContentListSchema = Joi.object({
    userId: Joi.number().required().min(1).integer(),
    page: Joi.number().optional().default(DEFAULT_PAGE).min(MIN_PAGE).integer(),
    contentTypes: Joi.string().optional().pattern(new RegExp(`${contentTypes.MOVIE}|${contentTypes.SERIES}`)),
    pageSize: Joi.number().optional().default(DEFAULT_PAGE).min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).integer(),
});
