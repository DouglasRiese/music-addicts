export const Controller = (path = ''): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata('path', path, target);
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }
    };
};