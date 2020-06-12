import { HttpStatusCode } from "../src/enum";
import {httpHandler, NotFoundException} from '../src';

const testHttpMethod = httpHandler(() => {
    return {
        test: true,
    };
});

describe('HttpHandler', () => {
    it('Will return 200', async () => {
        const result = await testHttpMethod();

        expect(result.status).toBe(HttpStatusCode.OK);
    });

    it('Can have different default return value', async () => {
        const testHttpMethod = httpHandler(() => {
            return {
                test: true,
            };
        }, HttpStatusCode.NO_CONTENT);

        const result = await testHttpMethod();

        expect(result.status).toBe(HttpStatusCode.NO_CONTENT);
    });

    describe('Can return http exceptions using exceptions', () => {
        it('NotFoundException', async () => {
            const testHttpMethod = httpHandler(() => {
                throw new NotFoundException();
    
                return {
                    test: true,
                };
            }, HttpStatusCode.NO_CONTENT);
    
            const result = await testHttpMethod();
    
            expect(result.status).toBe(HttpStatusCode.NOT_FOUND);
        })
    });
});
