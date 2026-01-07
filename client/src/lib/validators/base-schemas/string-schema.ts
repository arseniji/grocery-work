import type { BaseValidatorOptions, Rule, ValidatorError } from "../types";
import { Schema } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface StringValidatorOptions extends BaseValidatorOptions {}

export class StringSchema extends Schema<string> {
  private rules: Rule[] = [];
  private schemaValue: unknown;

  constructor(options?: StringValidatorOptions) {
    super();
    this.schemaValue = undefined;
    this.rules.push({
      message: options?.message || "Поле должно быть строкой",
      ruleFunction: (value: unknown) => typeof value === "string",
    });
  }

  validate(value: unknown): string | ValidatorError {
    this.schemaValue = value;
    for (const rule of this.rules) {
      if (!rule.ruleFunction(this.schemaValue)) {
        return { message: rule.message };
      }
    }
    return value as string;
  }

  min(length: number, options?: StringValidatorOptions): StringSchema {
    const msg = options?.message || `Минимальная длина поля ${length}`;
    this.rules.push({
      message: msg,
      ruleFunction: (value: string) => value.length >= length,
    });

    return this;
  }

  max(length: number, options?: StringValidatorOptions): StringSchema {
    const msg = options?.message || `Максимальная длина поля ${length}`;
    this.rules.push({
      message: msg,
      ruleFunction: (value: string) => value.length <= length,
    });

    return this;
  }

  regexp(reg: RegExp, options?: StringValidatorOptions): StringSchema {
    const msg =
      options?.message || `Поле не выполняет требования регклярного выражения`;

    this.rules.push({
      message: msg,
      ruleFunction: (value: string) => reg.test(value),
    });

    return this;
  }

  transform(
    transformator: (value: string) => string,
    options?: StringValidatorOptions
  ): StringSchema {
    const msg = options?.message || `Поле нельзя преобразовать`;
    try {
      this.schemaValue = transformator(this.schemaValue as string);

      this.rules.push({
        message: msg,
        ruleFunction: () => true,
      });
    } catch (err) {
      const error = err as Error;

      this.rules.push({
        message: error.message,
        ruleFunction: () => false,
      });
    }
    return this;
  }
}
