import { StringSchema } from "./base-schemas";
import type { BaseValidatorOptions } from "./types";

class Validator {
  string(options?: BaseValidatorOptions): StringSchema {
    return new StringSchema(options);
  }
}

export const validator = new Validator();
