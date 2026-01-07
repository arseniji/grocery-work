import type { BaseValidatorOptions, Rule, ValidatorError } from "../types";
import { Schema } from "./schema";

export class StringSchema extends Schema<string> {
  private rules: Rule[] = [];

  constructor(options?: BaseValidatorOptions) {
    super();
    this.rules.push({
      message: options?.message || "Поле должно быть строкой",
      ruleFunction: (value: unknown) => typeof value === "string",
    });
  }

  validate(value: unknown): string | ValidatorError {
    for (const rule of this.rules) {
      if (!rule.ruleFunction(value)) {
        return { message: rule.message };
      }
    }
    return value as string;
  }

  min(length: number, options?: BaseValidatorOptions): StringSchema {
    const msg = options?.message || `Минимальная длина поля ${length}`;
    this.rules.push({
      message: msg,
      ruleFunction: (value: string) => value.length >= length,
    });

    return this;
  }

  max(length: number, options?: BaseValidatorOptions): StringSchema {
    const msg = options?.message || `Максимальная длина поля ${length}`;
    this.rules.push({
      message: msg,
      ruleFunction: (value: string) => value.length <= length,
    });

    return this;
  }
}
