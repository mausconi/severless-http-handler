import { isResponseType } from "./utils";
import {
  httpResponseHandler,
  httpResponsePayloadHandler,
} from "./http.response.handler";
import { httpErrorHandler } from "./http.error.handler";
import { HttpStatusCode } from "./enum";
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

export type APIGatewayJsonEvent<
  T extends { [s: string]: any }
> = APIGatewayEvent & {
  json: T;
};

export type HttpHandlerFunction<T, R> = (
  event?: APIGatewayEvent | APIGatewayJsonEvent<T>,
  context?: Context,
) => Promise<void | Partial<APIGatewayProxyResult> | APIGatewayProxyResult | R>;

/**
 * A universal wrapper function response hander for aws handlers
 *
 * @param fn your custom handler function
 * @param defaultStatus Http Status Code
 * @param errorHandling if set to 'error' response will not be returned, set to true or 'log' for a logged response. 'error' is meant for testing to omit the response to see the exception
 */
export const httpHandler = <T extends { [s: string]: any }, R extends any>(
  fn: HttpHandlerFunction<T, R>,
  defaultStatus: HttpStatusCode = HttpStatusCode.OK,
  errorHandling: "log" | "error" | boolean = false,
): ((
  event: APIGatewayEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>) => (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return new Promise(async (resolve) => {
    let jsonEvent: APIGatewayJsonEvent<T>;

    if (typeof event.body === "string") {
      // TODO check content-type?
      jsonEvent = { ...event, json: JSON.parse(event.body) };
    }

    try {
      const result = await fn(jsonEvent || event, context);

      if (isResponseType(result)) {
        if (!result.hasOwnProperty("statusCode"))
          result.statusCode = defaultStatus;

        if (result.body) result.body = httpResponsePayloadHandler(result.body);

        resolve(result);
      }

      resolve(httpResponseHandler(result, defaultStatus));
    } catch (error) {
      if (errorHandling) {
        switch (errorHandling) {
          case "error":
            console.error(error);
            break;
          case "log":
          default:
            console.log(error);
            break;
        }
      }

      resolve(httpErrorHandler(error));
    }
  });
};
