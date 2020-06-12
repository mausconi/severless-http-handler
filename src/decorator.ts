import { httpErrorHandler } from "./http.error.handler";
import { HttpStatusCode } from "./enum";
import { httpResponseHandler } from "./http.response.handler";
import { isResponseType } from "./utils";

export const HttpHandler = (
  defaultStatus: HttpStatusCode = HttpStatusCode.OK,
): MethodDecorator => (
  target: Object,
  key: string | Symbol,
  descriptor: PropertyDescriptor,
) => {
  const originalValue = descriptor.value;

  descriptor.value = async function (...args) {
    try {
      const result = originalValue.apply(this, args);

      if (isResponseType(result)) {
        return result;
      }

      return httpResponseHandler(result, defaultStatus);
    } catch (error) {
      httpErrorHandler(error);
    }
  };
};
