import { isObject } from "./utils";
import { HttpResponse } from "./interfaces";
import { HttpStatusCode } from "./enum";

export const httpResponsePayloadHandler = (payload: any): string =>
  isObject(payload) ? JSON.stringify(payload) : String(payload);

export const httpResponseHandler = (
  payload: any,
  status: HttpStatusCode,
): HttpResponse => ({
  body: httpResponsePayloadHandler(payload),
  status,
});
