import { isResponseType } from "./utils";
import { httpResponseHandler } from "./http.response.handler";
import { httpErrorHandler } from "./http.error.handler";
import { HttpStatusCode } from "./enum";
import { HttpResponse } from "./interfaces";

export const httpHandler = (
  fn: Function,
  defaultStatus: HttpStatusCode = HttpStatusCode.OK,
): ((...arg: any[]) => Promise<HttpResponse>) => (
  ...args
): Promise<HttpResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fn.apply(this, args);

      if (isResponseType(result)) {
        resolve(result);
      }

      resolve(httpResponseHandler(result, defaultStatus));
    } catch (error) {
      resolve(httpErrorHandler(error));
    }
  });
};
