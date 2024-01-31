import { validateCountry } from "@utils";
import Joi from "joi";

export class GetSeasonDto {
    seriesId: number;
    seasonId: number;
    country: string;
}

export const GetSeasonSchema = Joi.object({
    seriesId: Joi.number().required().integer(),
    seasonId: Joi.number().required().integer().min(0),
    country: Joi.string().custom(validateCountry).required(),
});
