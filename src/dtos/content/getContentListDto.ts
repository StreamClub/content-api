import Joi from "joi";

export class GetContentListDto {
    userId: string;
    page: number;
    pageSize: number;
}

export const GetContentListSchema = Joi.object({
    userId: Joi.number().required().min(1).integer(),
    page: Joi.number().optional().default(1).min(1).integer(),
    pageSize: Joi.number().optional().default(20).min(1).max(20).integer(),
});
