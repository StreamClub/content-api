import { validateCountry } from "@utils";
import Joi from "joi";

export class GetSUserStreamServiceDto {
    userId: string;
    country: string;
    page: number;
    pageSize: number;
}

export const GetSUserStreamServiceSchema = Joi.object({
    userId: Joi.number().required().min(1).integer(),
    country: Joi.string().custom(validateCountry).required(),
    page: Joi.number().optional().default(1).min(1).integer(),
    pageSize: Joi.number().optional().default(20).min(1).max(20).integer(),
});
