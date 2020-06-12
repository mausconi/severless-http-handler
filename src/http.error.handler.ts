import { HttpErrorResponseInterface, HttpResponse } from "./interfaces";
import { HttpErrorException } from "./exceptions/http.error.exception";
import { HttpStatusCode } from "./enum";

const isHttpException = (
  error: Error | HttpErrorException,
): error is HttpErrorException => error.hasOwnProperty("status");

export const httpErrorHandler = (
  error: HttpErrorResponseInterface | Error,
): HttpResponse => ({
  statusCode: isHttpException(error)
    ? error.getStatus()
    : HttpStatusCode.INTERNAL_SERVER_ERROR,
  message: isHttpException(error) ? error.message : "Internal server error",
  headers: isHttpException(error) && Object.keys(error.headers).length >= 1 ? error.headers : undefined,
  body: isHttpException(error) ? error.getData() : undefined,
});
