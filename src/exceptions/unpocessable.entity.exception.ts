import { HttpStatusCode } from "../enum";
import { HttpErrorException } from "./http.error.exception";

export class UnprocessableEntityException extends HttpErrorException {
  constructor(readonly message: string = "Not found") {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
  }
}
