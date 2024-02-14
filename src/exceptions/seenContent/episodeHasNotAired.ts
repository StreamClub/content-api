import { StatusCodes } from "http-status-codes";
import { ApiException } from "../apiException";

export class EpisodeHasNotAiredException extends ApiException {
    constructor() {
        super("El episodio no se ha estrenado");
        this.code = StatusCodes.CONFLICT;
        this.description = "Episode has not aired yet";
    }
}
