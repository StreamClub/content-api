import Joi from "joi";

export class GetSimilarMoviesDto {
    movieIds: number[];
}

export const GetSimilarMoviesSchema = Joi.object({
    movieIds: Joi.string().pattern(/^[0-9]+(,[0-9]+)*$/).required().allow(''),
});
