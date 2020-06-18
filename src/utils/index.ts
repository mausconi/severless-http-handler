import { APIGatewayProxyResult } from "aws-lambda";

export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === "object";

export const isNil = (obj: any): obj is null | undefined =>
  isUndefined(obj) || obj === null;

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === "undefined";

export const isResponseType = (obj: any): obj is APIGatewayProxyResult =>
  obj.hasOwnProperty("statusCode") || obj.hasOwnProperty("body");
