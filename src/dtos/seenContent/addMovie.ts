import Joi from "joi";

export class AddSeenMovieDto {
    movieId: string;
}

export const AddSeenMovieSchema = Joi.object({
    movieId: Joi.number().required().integer().min(1),
});
