import Joi from "joi";

export class GetSubscribeRecommendationsDto {
    friendsIds: number[];
}

export const GetSubscribeRecommendationsSchema = Joi.object({
    friendsIds: Joi.string().pattern(/^[0-9]+(,[0-9]+)*$/).required().allow(''),
});
