import Joi from "joi";

export class GetArtistDto {
    artistId: number;
}

export const GetArtistSchema = Joi.object({
    artistId: Joi.number().required().integer(),
});
