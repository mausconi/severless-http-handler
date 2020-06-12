import { HttpStatusCode } from "./enum";

export interface HttpErrorResponseInterface extends Error {
  readonly status: HttpStatusCode;
  readonly data?: any;
}

export type HttpResponseType<T> = {
  statusCode: HttpStatusCode;
  body: T;
  headers?: { [s: string]: string | number };
};

export type HttpResponse = {
  statusCode: HttpStatusCode;
  body?: string;
  message?: string;
  headers?: { [s: string]: string | number };
};
