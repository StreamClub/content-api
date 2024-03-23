import { DEFAULT_PAGE, MAX_PAGE_SIZE, MIN_PAGE, MIN_PAGE_SIZE } from "@config";
import { validateCountry } from "@utils";
import Joi from "joi";

export class GetUserStreamServiceDto {
    userId: string;
    country: string;
    page: number;
    pageSize: number;
}

export const GetUserStreamServiceSchema = Joi.object({
    userId: Joi.number().required().min(1).integer(),
    country: Joi.string().custom(validateCountry).required(),
    page: Joi.number().optional().default(DEFAULT_PAGE).min(MIN_PAGE).integer(),
    pageSize: Joi.number().optional().default(DEFAULT_PAGE).min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).integer(),
});
