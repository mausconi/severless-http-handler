import { HttpStatusCode } from "./enum";

export interface HttpErrorResponseInterface extends Error {
  readonly status: HttpStatusCode;
  readonly data?: any;
}
