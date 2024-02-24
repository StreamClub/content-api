import { MAX_STRING_LENGTH, MIN_PAGE } from "@config";
import Joi from "joi";

export class SearchArtistDto {
    query: string;
    page: number;
}

export const SearchArtistSchema = Joi.object({
    query: Joi.string().max(MAX_STRING_LENGTH).required(),
    page: Joi.number().min(MIN_PAGE),
});
