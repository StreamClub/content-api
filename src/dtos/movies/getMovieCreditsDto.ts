import Joi from "joi";

export class GetMovieCreditsDto {
    movieId: number;
}

export const GetMovieCreditsSchema = Joi.object({
    movieId: Joi.number().required().min(0).integer(),
});
