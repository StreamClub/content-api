import Joi from "joi";

export class UpdateWatchlistPrivacyDto {
    isWatchlistPrivate: boolean;
}

export const UpdateWatchlistPrivacySchema = Joi.object({
    isWatchlistPrivate: Joi.boolean().required(),
});
