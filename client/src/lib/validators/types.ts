export interface BaseValidatorOptions {
  message?: string;
}

export interface ValidatorError {
  message: string;
}

export interface Rule {
  message: string;
  ruleFunction: (value: any) => boolean;
}
