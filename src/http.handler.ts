import { isResponseType } from "./utils";
import { httpResponseHandler } from "./http.response.handler";
import { httpErrorHandler } from "./http.error.handler";
import { HttpStatusCode } from "./enum";
import { HttpResponse, HttpHandlerMethod } from "./interfaces";
import { APIGatewayEvent, Context } from "aws-lambda";

export const httpHandler = (
  fn: HttpHandlerMethod,
  defaultStatus: HttpStatusCode = HttpStatusCode.OK,
): ((event: APIGatewayEvent, context: Context) => Promise<HttpResponse>) => (
  event: APIGatewayEvent,
  context: Context,
): Promise<HttpResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fn(event, context);

      if (isResponseType(result)) {
        resolve(result);
      }

      resolve(httpResponseHandler(result, defaultStatus));
    } catch (error) {
      resolve(httpErrorHandler(error));
    }
  });
};
