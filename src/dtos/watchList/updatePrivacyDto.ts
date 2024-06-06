import Joi from "joi";

export class UpdatePrivacyDto {
    isWatchlistPrivate: boolean;
}

export const UpdatePrivacySchema = Joi.object({
    isWatchlistPrivate: Joi.boolean().required(),
});
