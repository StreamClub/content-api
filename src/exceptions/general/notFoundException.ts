import { StatusCodes } from "http-status-codes";
import { ApiException } from "../apiException";

export class NotFoundException extends ApiException {
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.NOT_FOUND;
    this.description = "Not Found";
  }
}
