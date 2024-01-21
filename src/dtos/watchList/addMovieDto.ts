import Joi from "joi";

export class AddMovieDto {
    userId: string;
    contentId: string;
    type: string;
}

export const AddMovieSchema = Joi.object({
    userId: Joi.number().required(),
    contentId: Joi.number().required(),
    type: Joi.string().required(),
});
