import { MAX_STRING_LENGTH } from "@config";
import Joi from "joi";

export class SearchMovieDto {
    query: string;
    page: number;
}

export const SearchMovieSchema = Joi.object({
    query: Joi.string().max(MAX_STRING_LENGTH).required(),
    page: Joi.number().min(1),
});
