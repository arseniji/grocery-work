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

  object(
    shape: Record<any, any>,
    options?: ObjectValidatorOptions
  ): ObjectSchema {
    return new ObjectSchema(shape, options);
  }
}

export const validator = new Validator();
