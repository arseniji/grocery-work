import type { BaseValidatorOptions } from "../types";
import { Schema } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NumberValidatorOptions extends BaseValidatorOptions {}

export class NumberSchema extends Schema<number> {
  constructor(options?: NumberValidatorOptions) {
    super();
    this.rules.push({
      message: options?.message || "Поле должно быть числом",
      ruleFunction: (value: unknown) => typeof value === "number",
    });
  }

  infer(): string {
    return "number";
  }

  min(min: number, options?: NumberValidatorOptions): NumberSchema {
    const msg = options?.message || `Минимальное значение ${min}`;
    this.rules.push({
      message: msg,
      ruleFunction: (value: number) => value >= min,
    });

    return this;
  }

  max(max: number, options?: NumberValidatorOptions): NumberSchema {
    const msg = options?.message || `Максимальное значение ${max}`;
    this.rules.push({
      message: msg,
      ruleFunction: (value: number) => value <= max,
    });

    return this;
  }

  transform(
    transformator: (value: number) => number,
    options?: NumberValidatorOptions
  ): NumberSchema {
    const msg = options?.message || `Поле нельзя преобразовать`;
    try {
      this.schemaValue = transformator(this.schemaValue as number);

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
