import Joi from "joi";

export class GetWatchlistDto {
    userId: string;
    page: number;
    pageSize: number;
}

export const GetWatchlistSchema = Joi.object({
    userId: Joi.number().required(),
    page: Joi.number().optional().default(1).min(1),
    pageSize: Joi.number().optional().default(20).max(20),
});
