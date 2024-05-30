import Joi from "joi";

export class GetContentResumeDto {
    ids: number[];
}

export const GetContentResumeSchema = Joi.object({
    ids: Joi.string().pattern(/^[0-9]+(,[0-9]+)*$/).optional().allow(''),
});
