import { DEFAULT_PAGE, MAX_PAGE_SIZE, MIN_PAGE, MIN_PAGE_SIZE } from "@config";
import Joi from "joi";

export class GetMovieReviewDto {
    movieId: number;
    page: number;
    pageSize: number;
}

export const GetMovieReviewSchema = Joi.object({
    movieId: Joi.number().required().integer().min(1),
    page: Joi.number().optional().default(DEFAULT_PAGE).min(MIN_PAGE).integer(),
    pageSize: Joi.number().optional().default(DEFAULT_PAGE).min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).integer(),

});
