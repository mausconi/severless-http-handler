import { httpHandler } from "./handler";

export const HttpHandler = (): MethodDecorator => (target: Object, key: string | Symbol, descriptor: PropertyDescriptor) => {
    const originalValue = descriptor.value;

    descriptor.value = async function(...args) {
        try {
            return originalValue.apply(this, args);
        } catch (error) {
            httpHandler(error);
        }
    }
};
