## AWS Lambda generic error handling for http

Proposal for http error responses with lambda

### Usage

```ts
import {HttpHandler, NotFoundException} from '@homeservenow/lambda';

export const myHandler = httpHandler((event: any) => {
    throw new NotFoundExpcetion();
});
```

#### result

```json
{
    "status": 404,
    "message": "Not Found",
}
```

### Why? 

There's been a lot of occurrences of nested conditions to return a response payload. 

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
    if (!this.thing) {
        return this.responseObject(202, {});
    }

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
### Decorators 

For classes we can use the httpHandlerDecorator like so 

```ts
export class Handlers {
    @HttpHandlerDecorator()
    myMethod = () => {

    }
}
```
