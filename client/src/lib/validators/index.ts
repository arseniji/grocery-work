import {
  NumberSchema,
  StringSchema,
  type NumberValidatorOptions,
  type StringValidatorOptions,
} from "./base-schemas";

class Validator {
  string(options?: StringValidatorOptions): StringSchema {
    return new StringSchema(options);
  }

  number(options?: NumberValidatorOptions): NumberSchema {
    return new NumberSchema(options);
  }
}

export const validator = new Validator();
