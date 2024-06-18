import { MAX_STRING_LENGTH, MIN_PAGE } from "@config";
import { validateCountry } from "@utils";
import Joi from "joi";

export class DiscoverContentDto {
    page: number;
    country: string;
    genderIds: string;
}

export const DiscoverContentSchema = Joi.object({
    page: Joi.number().min(MIN_PAGE).integer(),
    country: Joi.string().custom(validateCountry).required(),
    genderIds: Joi.string().pattern(/^[0-9]+(,[0-9]+)*$/).optional().allow(''),
});
