import {
  httpHandler,
  NotFoundException,
  HttpStatusCode,
  UnprocessableEntityException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  APIGatewayJsonEvent,
} from "../src";
import { createMockAPIGatewayEvent } from "./events";
import * as mockContext from "aws-lambda-mock-context";

const testHttpMethod = httpHandler(() => {
  return {
    test: true,
  };
});

describe("HttpHandler", () => {
  const context = mockContext();

  it("Will return 200", async () => {
    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.OK);
  });

  it("Can have different default return value", async () => {
    const testHttpMethod = httpHandler(() => {
      return {
        test: true,
      };
    }, HttpStatusCode.NO_CONTENT);

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.NO_CONTENT);
  });

  describe("Can return http exceptions using exceptions", () => {
    it("NotFoundException", async () => {
      const testHttpMethod = httpHandler(() => {
        throw new NotFoundException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
      );

      expect(result.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    });

    it("UnprocessableEntityException", async () => {
      const testHttpMethod = httpHandler(() => {
        throw new UnprocessableEntityException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
      );

      expect(result.statusCode).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
    });

    it("BadRequestException", async () => {
      const testHttpMethod = httpHandler(() => {
        throw new BadRequestException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
      );

      expect(result.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it("UnauthorizedException", async () => {
      const testHttpMethod = httpHandler(() => {
        throw new UnauthorizedException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
      );

      expect(result.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
    });

    it("ForbiddenException", async () => {
      const testHttpMethod = httpHandler(() => {
        throw new ForbiddenException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
      );

      expect(result.statusCode).toBe(HttpStatusCode.FORBIDDEN);
    });
  });

  describe('Can override default response', () => {
      it('Can return response object with statusCode', async () => {
        const testHttpMethod = httpHandler(() => {
            return {
                statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
            };
          });
          
        expect(await testHttpMethod(
            createMockAPIGatewayEvent({}),
            context,
        )).toStrictEqual({statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY});
      });

      it('Can return response object with body', async () => {
        const testHttpMethod = httpHandler(() => {
            return {
                body: "test",
            };
          });
          
        expect(await testHttpMethod(
            createMockAPIGatewayEvent({}),
            context,
        )).toStrictEqual({body: "test", statusCode: 200});
      });

      it('Can return response object with body, statusCode and headers', async () => {
        const testHttpMethod = httpHandler(() => {
            return {
                statusCode: HttpStatusCode.SUCCESS,
                body: {
                    someString: "hello",
                },
                headers: {
                    ['X-Some-Header']: "test",
                },
            };
          });
          
        expect(await testHttpMethod(
            createMockAPIGatewayEvent({}),
            context,
        )).toStrictEqual({body: "{\"someString\":\"hello\"}", statusCode: 201, headers: {["X-Some-Header"]: "test"}});
      });
  });

  describe("Can return additional exception data", () => {
      it('Can return validation errors', async () => {
        const validationErrorsHanlder = httpHandler<{name?: string}>((event: APIGatewayJsonEvent<{name?: string}>) => {
            if (!event.body || !event.json.name) {
                throw new BadRequestException("Validation errors", [
                    {
                        target: event.body,
                        property: "name",
                        value: event.json.name,
                        reason: "Name is required",
                    },
                ]);
            }
        
            console.log("valid", event.json.name);
        });

        expect(await validationErrorsHanlder(createMockAPIGatewayEvent({
            body: "{}",
        }), context)).toStrictEqual({
            statusCode: HttpStatusCode.BAD_REQUEST,
            message: "Validation errors",
            body: JSON.stringify([{
                    target: {},
                    property: "name",
                    value: undefined,
                    reason: "Name is required",
            }]),
            headers: undefined,
        });
      });
  });
});
