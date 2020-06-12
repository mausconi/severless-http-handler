import {
  httpHandler,
  NotFoundException,
  HttpStatusCode,
  UnprocessableEntityException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
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
  });
});
