import Joi from "joi";

export class GetMovieDto {
    movieId: string;
}

export const GetMovieSchema = Joi.object({
    movieId: Joi.number().required(),
});
