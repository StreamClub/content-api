import Joi from "joi";

export class AddSeenSeriesDto {
    seriesId: string;
}

export const AddSeenSeriesSchema = Joi.object({
    seriesId: Joi.number().required().integer().min(1),
});
