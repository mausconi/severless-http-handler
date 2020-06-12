import { HttpStatusCode } from "./enum";

export interface HttpErrorResponseInterface extends Error {
  readonly status: HttpStatusCode;
  readonly data?: any;
}

export type HttpResponse = {
  status: HttpStatusCode;
  body: string;
  headers?: { [s: string]: string | number };
};
