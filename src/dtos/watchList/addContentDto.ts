import { validateContentType } from "@utils";
import Joi from "joi";

export class AddContentDto {
    userId: string;
    contentId: string;
    contentType: string;
}

export const AddContentSchema = Joi.object({
    userId: Joi.number().required(),
    contentId: Joi.number().required(),
    contentType: Joi.string().custom(validateContentType).required(),
});
