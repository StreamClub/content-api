import { MIN_PAGE } from "@config";
import { validateCountry } from "@utils";
import Joi from "joi";

export class DiscoverContentDto {
    page: number;
    country: string;
    genderIds: string;
    runtimeGte: number;
    runtimeLte: number;
    inMyPlatforms: boolean; //should only be true if passed in the query
}

export const DiscoverContentSchema = Joi.object({
    page: Joi.number().min(MIN_PAGE).integer(),
    country: Joi.string().custom(validateCountry).required(),
    genderIds: Joi.string().pattern(/^[0-9]+(,[0-9]+)*$/).optional().allow(''),
    runtimeGte: Joi.number().integer().min(0).optional(),
    runtimeLte: Joi.number().integer().min(0).optional(),
    inMyPlatforms: Joi.boolean().optional()
});
