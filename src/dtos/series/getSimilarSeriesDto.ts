import Joi from "joi";

export class GetSimilarSeriesDto {
    seriesIds: number[];
}

export const GetSimilarSeriesSchema = Joi.object({
    seriesIds: Joi.string().pattern(/^[0-9]+(,[0-9]+)*$/).required().allow(''),
});
