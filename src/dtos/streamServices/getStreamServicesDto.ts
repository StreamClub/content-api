import { validateCountry } from "@utils";
import Joi from "joi";

export class GetStreamServiceDto {
    country: string;
}

export const GetStreamServiceSchema = Joi.object({
    country: Joi.string().custom(validateCountry).required(),
});
