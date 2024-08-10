import Joi from "joi";

export class GetStreamServicesStatsDto {
    months: number;
}

export const GetStreamServicesStatsSchema = Joi.object({
    months: Joi.number().min(1).max(12).required(),
});
