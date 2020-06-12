## AWS Lambda generic error handling for http

Proposal for universal http + error handling responses for lambda

### Usage

```ts
import {HttpHandler, NotFoundException} from '@homeservenow/lambda';
import {APIGatewayEvent} from 'aws-lambda';

export const myHandler = httpHandler(async (event: APIGatewayEvent): Promise<{test: true} | never> => {
    const object: {test: true} | undefined = await findObjectInDatabase(event.parameters.id);
    
    if (!object) {
        throw new NotFoundException();
    }

    return object;
});
```

#### Results

**If there is no object**
```json
{
    "statusCode": 404,
    "message": "Not Found",
}
```

**If there is an object returned**

```json
{
    "statusCode": 200,
    "body": {
        "test": true
    }
}
```

### Why? 

There's been a lot of occurrences of nested conditions to return a response payload. 

The idea of the httpHandler wrapper is to: 
- Eliminate incorrect status code usage
- Eliminate nested if statements
- Multiple massive try catch blocks
- Add default handling for non handled exceptions
- Force the usage of strong types for http methods such removing the use of "any" for event types and context'

Eliminating the above will result in cleaner and more easy to read code as well enforced types reducing errors. As well as handling responses nicely and enabling other features to be added such as logging etc

```ts
export const myHandler = (event: any) => {
    if (this.notFound) {
        return this.responseObject(202, {});
    }
}
```

Or even 

```ts
export const myHandler = (event: any) => {
    const object = getObjectFromDatabase(event.parameters.id);

    if (object) {

        try {
            ...
        } catch (e) {
            return this.responseObject(404, {});
        }
        
        try {
            ...
        } catch (e) {
            return this.responseObject(400, {});
        }
        try {
            ...
        } catch (e) {
            return this.responseObject(422, {});
        }

        return this.responseObject(202, {});
    } else {
        return this.responseObject(502, "Not Found");
    }
}
```

We could reduce this by removing the need for so many try catch statements however not limit the use cases

```ts
export const myHandler = httpHandler((event: any) => {
    if (!this.thing) {
      throw new NotFoundException('This thing was not found');
    }

    try {
        ...
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message);
    }
    
     try {
        ...
    } catch (e: ValidationErrors) {
      throw new BadRequestException(e.errors);
    }
    
    if (this.database.emailExists(event.body.email)) {
      throw new UnprocessableEntityException(`email [${event.body.email}] is already registered`);
    }
});
```

## Simple implementation 

```ts
export const mySimpleHandler = httpHanlder(() => {
    return "Hello! I am a simple return";
});
```

## Default status code

```ts
import {HttpStatusCode, httpHandler} from "@homeservenow/lambda";

export const defaultStatusNoContent = httpHandler(() => {
    console.log("I don't return so I am a void");
}, HttpStatusCode.NO_CONTENT);
```

## Promises

```ts
export const awaitThisHandler = httpHandler(async (event: APIGatewayEvent): Promise<{success: boolean}> => {
    const result = await awaitSomeFunction();

    return {sucess: result !== undefined};
});
```

## Overriding response handling

Returning an object with either body or statusCode defined will result in httpHandler not manipulating your response.

```ts
const returnAResponse = httpHandler(() => {
    return {
        statusCode: HttpStatusCode.NO_CONTENT,
        headers: {
            [`X-Some-header`]: 'header value',
        },
    };
});

const returnAResponseWithoutCodeButWithBody = httpHandler(() => {
    return {
        body: {
            success: true,
        },
    };
});
```

### Decorators 

For classes we can use the httpHandlerDecorator like so 

```ts
export class Handlers {
    @HttpHandlerDecorator()
    myMethod = () => {

    }
}
```
