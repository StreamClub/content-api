import { validateContentType } from "@utils";
import Joi from "joi";

export class AddContentDto {
    contentId: string;
    contentType: string;
}

export const AddContentSchema = Joi.object({
    contentId: Joi.number().required().integer().min(1),
    contentType: Joi.string().custom(validateContentType).required(),
});
