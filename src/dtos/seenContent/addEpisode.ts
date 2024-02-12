import Joi from "joi";

export class AddSeenEpisodeDto {
    seriesId: string;
    seasonId: string;
    episodeId: string;
}

export const AddSeenEpisodeSchema = Joi.object({
    seriesId: Joi.number().required().integer().min(1),
    seasonId: Joi.number().required().integer().min(0),
    episodeId: Joi.number().required().integer().min(1),
});
