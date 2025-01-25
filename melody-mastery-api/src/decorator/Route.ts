import {RouteDefinition} from './RouteDefinition';

export const Route = (method = 'get', param = ''): MethodDecorator => {
    return (target, propertyKey: string): void => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Add new route.
        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;
        routes.push({
            method,
            param,
            action: propertyKey,
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};