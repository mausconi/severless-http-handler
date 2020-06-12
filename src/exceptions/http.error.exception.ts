import { HttpErrorResponseInterface } from "../interfaces";
import { HttpStatusCode } from "../enum";

export class HttpErrorException extends Error
  implements HttpErrorResponseInterface {
  constructor(
    readonly message: string,
    readonly status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    readonly data?: any,
    readonly headers: { [s: string]: string | number } = {},
  ) {
    super(message);
  }

  getStatus(): HttpStatusCode {
    return this.status;
  }

  getData(): string | undefined {
    return typeof this.data === "string"
      ? this.data
      : Array.isArray(this.data) || this.data === "object"
      ? JSON.stringify(this.data)
      : undefined;
  }
}
