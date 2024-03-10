import { validateCountry } from "@utils";
import Joi from "joi";

export class GetMovieDto {
    movieId: number;
    country: string;
}

export const GetMovieSchema = Joi.object({
    movieId: Joi.number().required().min(0).integer(),
    country: Joi.string().custom(validateCountry).required(),
});
