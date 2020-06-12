import { HttpStatusCode } from "../enum";
import { HttpErrorException } from "./http.error.exception";

export class UnauthorizedException extends HttpErrorException {
  constructor(readonly message: string = "Not found") {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}
