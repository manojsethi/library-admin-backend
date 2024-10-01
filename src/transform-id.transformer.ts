import {
  Expose,
  ExposeOptions,
  Transform,
  TransformFnParams,
} from 'class-transformer';

export const ExposeId =
  (options?: ExposeOptions): PropertyDecorator =>
  (target: object, propertyKey: string | symbol) => {
    Transform(
      (params: TransformFnParams) =>
        params.obj[options?.name ? options.name : propertyKey],
    )(target, propertyKey);
    Expose(options)(target, propertyKey);
  };
