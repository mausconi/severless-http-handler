import { isObject } from "./utils";
import { HttpStatusCode } from "./enum";
import { APIGatewayProxyResult } from "aws-lambda";

export const httpResponsePayloadHandler = (payload: any): string =>
  isObject(payload) ? JSON.stringify(payload) : String(payload);

export const httpResponseHandler = (
  payload: any,
  statusCode: HttpStatusCode,
): APIGatewayProxyResult => ({
  body: httpResponsePayloadHandler(payload),
  statusCode,
});
