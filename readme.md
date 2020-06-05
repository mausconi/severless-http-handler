## AWS Lambda generic error handling for http

Proposal for http error responses with lambda

### Usage

```ts
import {HttpHandler, NotFoundException} from '@homeservenow/lambda';


@HttpHandler()
export const myHandler = (event: any) => {
    throw new NotFoundExpcetion();
}
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
