import { isObject } from "./utils";
import { HttpResponse } from "./interfaces";
import { HttpStatusCode } from "./enum";

export const httpResponsePayloadHandler = (payload: any): string =>
  isObject(payload) ? JSON.stringify(payload) : String(payload);

export const httpResponseHandler = (
  payload: any,
  statusCode: HttpStatusCode,
): HttpResponse => ({
  body: httpResponsePayloadHandler(payload),
  statusCode,
});
