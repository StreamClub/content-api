import Joi from "joi";

export class GetWatchlistDto {
    userId: string;
}

export const GetWatchlistSchema = Joi.object({
    userId: Joi.number().required(),
});
