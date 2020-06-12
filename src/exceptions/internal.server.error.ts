import { HttpStatusCode } from "../enum";
import { HttpErrorException } from "./http.error.exception";

export class BadRequestException extends HttpErrorException {
  constructor(readonly message: string = "Internal Server Error") {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
