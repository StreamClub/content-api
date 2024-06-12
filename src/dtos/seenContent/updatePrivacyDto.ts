import Joi from "joi";

export class UpdateSeenContentPrivacyDto {
    isSeenContentListPrivate: boolean;
}

export const UpdateSeenContentPrivacySchema = Joi.object({
    isSeenContentListPrivate: Joi.boolean().required(),
});
