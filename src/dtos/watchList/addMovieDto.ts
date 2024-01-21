import Joi from "joi";

export class AddMovieDto {
    userId: string;
    movieId: string;
}

export const AddMovieSchema = Joi.object({
    userId: Joi.number().required(),
    movieId: Joi.number().required(),
});
