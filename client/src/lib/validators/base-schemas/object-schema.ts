import type { BaseValidatorOptions, ValidatorError } from "../types";
import { Schema } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ObjectValidatorOptions extends BaseValidatorOptions {}

export class ObjectSchema extends Schema<Record<any, any>> {
  private shape: Record<string, Schema<any>>;

  constructor(
    shape: Record<string, Schema<any>>,
    options?: ObjectValidatorOptions
  ) {
    super();
    this.rules.push({
      message: options?.message || "Значение должно быть объектом",
      ruleFunction: (value) => typeof value === "object" && value !== null,
    });
    this.shape = shape;
  }

  override validate(value: unknown): Record<string, any> | ValidatorError {
    const baseVal = super.validate(value);
    if (
      typeof baseVal === "object" &&
      baseVal !== null &&
      "message" in baseVal
    ) {
      return baseVal;
    }

    const resultObj: Record<string, any> = {};

    for (const key in this.shape) {
      const fieldValue = (value as Record<string, any>)[key];
      const result = this.shape[key].validate(fieldValue);
      resultObj[key] = result;
    }

    return resultObj;
  }
}
