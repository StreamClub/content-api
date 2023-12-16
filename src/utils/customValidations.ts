import { countries } from "@config";
import { CustomHelpers } from "joi";

export const validateCountry = (value: any, helper: CustomHelpers): any => {
    return (Object.values(countries).includes(value))
        ? true
        : helper.message({ "custom": `{{#label}} must be one of: ${Object.values(countries)}` });
}
