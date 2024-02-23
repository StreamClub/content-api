import { MAX_STRING_LENGTH, MIN_PAGE } from "@config";
import { validateCountry } from "@utils";
import Joi from "joi";

export class SearchContentDto {
    query: string;
    page: number;
    country: string;
}

export const SearchContentSchema = Joi.object({
    query: Joi.string().max(MAX_STRING_LENGTH).required(),
    page: Joi.number().min(MIN_PAGE),
    country: Joi.string().custom(validateCountry).required(),
});
