import Joi from "joi";

export class SearchMovieDto {
    query: string;
}

export const SearchMovieSchema = Joi.object({
    query: Joi.string().required(),
});
