import {
  NumberSchema,
  ObjectSchema,
  StringSchema,
  type NumberValidatorOptions,
  type ObjectValidatorOptions,
  type StringValidatorOptions,
} from "./base-schemas";

class Validator {
  string(options?: StringValidatorOptions): StringSchema {
    return new StringSchema(options);
  }

  number(options?: NumberValidatorOptions): NumberSchema {
    return new NumberSchema(options);
  }

  object<Shape extends Record<string, any>>(
    shape: Shape,
    options?: ObjectValidatorOptions
  ): ObjectSchema<Shape> {
    return new ObjectSchema(shape, options);
  }
}

export const validator = new Validator();

export type Infer<T> = T extends ObjectSchema<infer Shape>
  ? {
      [K in keyof Shape]: Infer<Shape[K]>;
    }
  : T extends StringSchema
  ? string
  : T extends NumberSchema
  ? number
  : any;
