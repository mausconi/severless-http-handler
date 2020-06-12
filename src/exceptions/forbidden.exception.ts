import { HttpStatusCode } from "../enum";
import { HttpErrorException } from "./http.error.exception";

export class ForbiddenException extends HttpErrorException {
  constructor(readonly message: string = "Not found", data?: any) {
    super(message, HttpStatusCode.FORBIDDEN, data);
  }
}
