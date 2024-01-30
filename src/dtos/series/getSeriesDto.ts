import { validateCountry } from "@utils";
import Joi from "joi";

export class GetSeriesDto {
    seriesId: number;
    country: string;
}

export const GetSeriesSchema = Joi.object({
    seriesId: Joi.number().required(),
    country: Joi.string().custom(validateCountry).required(),
});
