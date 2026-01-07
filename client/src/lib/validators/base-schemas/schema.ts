import type { Rule, ValidatorError } from "../types";

export abstract class Schema<T> {
  protected rules: Rule[] = [];
  protected schemaValue: unknown;

  constructor() {
    this.schemaValue = undefined;
  }

  validate(value: unknown): T | ValidatorError {
    this.schemaValue = value;
    for (const rule of this.rules) {
      if (!rule.ruleFunction(this.schemaValue)) {
        return { message: rule.message };
      }
    }
    return value as T;
  }

  parse(value: unknown): T {
    const valid = this.validate(value);
    if (typeof valid === "object" && valid !== null && "message" in valid) {
      throw new Error(valid.message);
    }
    return valid as T;
  }

  safeParse(value: unknown): {
    success: boolean;
    error?: ValidatorError;
    data?: T;
  } {
    const valid = this.validate(value);
    const isError =
      typeof valid === "object" && valid !== null && "message" in valid;
    return {
      success: !isError,
      error: isError ? (valid as ValidatorError) : undefined,
      data: isError ? undefined : (valid as T),
    };
  }
}
