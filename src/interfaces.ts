import { HttpStatusCode } from "./enum";
import { APIGatewayEvent, Context } from "aws-lambda";

export interface HttpErrorResponseInterface extends Error {
  readonly status: HttpStatusCode;
  readonly data?: any;
}

export type HttpResponseType<T> = {
  status: HttpStatusCode;
  body: T;
  headers?: { [s: string]: string | number };
};

export type HttpResponse = {
  status: HttpStatusCode;
  body: string;
  headers?: { [s: string]: string | number };
};

export type HttpHandlerMethod = (
  event: APIGatewayEvent,
  context: Context,
) => Promise<any> | any;
