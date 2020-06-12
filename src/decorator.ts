import { HttpStatusCode } from "./enum";
import { httpHandler } from "./http.handler";

export const HttpHandlerDecorator = (
  defaultStatus: HttpStatusCode = HttpStatusCode.OK,
): MethodDecorator => (
  target: Object,
  key: string | Symbol,
  descriptor: PropertyDescriptor,
) => {
  const originalValue = descriptor.value;

  descriptor.value = httpHandler(originalValue, defaultStatus);
};
