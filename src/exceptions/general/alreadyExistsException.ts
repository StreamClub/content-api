import { StatusCodes } from "http-status-codes";
import { ApiException } from "../apiException";

export class AlreadyExistsException extends ApiException {
    constructor(message: string) {
        super(message);
        this.code = StatusCodes.CONFLICT;
        this.description = "Resource Already Exists Exception";
    }
}
