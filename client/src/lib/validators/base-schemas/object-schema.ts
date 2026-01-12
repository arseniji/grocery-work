import type { BaseValidatorOptions, ValidatorError } from "../types";
import { Schema } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ObjectValidatorOptions extends BaseValidatorOptions {}

export class ObjectSchema<
  Shape extends Record<string, Schema<any>>
> extends Schema<Record<string, any>> {
  public shape: Shape;

  infer(): string {
    return "object";
  }

  constructor(shape: Shape, options?: ObjectValidatorOptions) {
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

  strict(options?: ObjectValidatorOptions): ObjectSchema<Shape> {
    const msg = options?.message || "Объект содержит лишние поля";
    this.rules.push({
      message: msg,
      ruleFunction: (value) =>
        Object.keys(value as Record<string, any>).every(
          (key) => key in this.shape
        ),
    });
    return this;
  }

  override safeParse(value: unknown): {
    success: boolean;
    errors: Partial<Record<keyof Shape | "base", ValidatorError>>;
    data: Record<string, any>;
  } {
    const result = this.validate(value);
    if (typeof result === "object" && result !== null && "message" in result) {
      return {
        success: false,
        errors: { base: result as ValidatorError } as Partial<
          Record<keyof Shape | "base", ValidatorError>
        >,
        data: (value as Record<string, any>) || {},
      };
    }

    const resultObj = result as Record<string, any>;
    const errors: Partial<Record<keyof Shape, ValidatorError>> = {};
    const data = (value as Record<string, any>) || {};

    for (const key in this.shape) {
      const val = resultObj[key];
      if (typeof val === "object" && val !== null && "message" in val) {
        errors[key] = val as ValidatorError;
      }
    }

    return {
      success: Object.keys(errors).length === 0,
      errors: errors as Partial<Record<keyof Shape | "base", ValidatorError>>,
      data,
    };
  }
}
