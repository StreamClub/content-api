import { StatusCodes } from "http-status-codes";
import { ApiException } from "../apiException";

export class DomainException extends ApiException {
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.CONFLICT;
    this.description = "Domain Exception";
  }
}
