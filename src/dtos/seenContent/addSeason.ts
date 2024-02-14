import Joi from "joi";

export class AddSeenSeasonDto {
    seriesId: string;
    seasonId: string;
}

export const AddSeenSeasonSchema = Joi.object({
    seriesId: Joi.number().required().integer().min(1),
    seasonId: Joi.number().required().integer().min(0),
});
