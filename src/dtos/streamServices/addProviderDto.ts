import Joi from "joi";

export class AddProviderDto {
    providerId: string;
}

export const AddProviderSchema = Joi.object({
    providerId: Joi.number().required().integer().min(1),
});
