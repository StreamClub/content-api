import Joi from "joi";

export class GetSeriesCreditsDto {
    seriesId: number;
}

export const GetSeriesCreditsSchema = Joi.object({
    seriesId: Joi.number().required().min(0).integer(),
});
