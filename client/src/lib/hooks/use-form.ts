import { useState, useCallback, useMemo } from "react";
import type { ObjectSchema } from "../validators/base-schemas/object-schema";

export interface UseFormOptions<Shape extends Record<string, any>> {
  defaultValues?: Partial<Record<keyof Shape, any>>;
}

export interface RegisterReturn {
  name: string;
  value: any;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export function useForm<Shape extends Record<string, any>>(
  schema: ObjectSchema<Shape>,
  options?: UseFormOptions<Shape>
) {
  const [data, setData] = useState<Partial<Record<keyof Shape, any>>>(
    options?.defaultValues || {}
  );

  const [touched, setTouched] = useState<Set<keyof Shape>>(new Set());

  const validation = useMemo(() => schema.safeParse(data), [schema, data]);

  const errors = validation.errors;

  const isValid = validation.success;

  const register = useCallback(
    (name: keyof Shape): RegisterReturn => {
      return {
        name: name as string,
        value: data[name] || "",
        onChange: (value: string) => {
          setData((prev) => ({ ...prev, [name]: value }));
        },
        onBlur: () => {
          setTouched((prev) => new Set(prev).add(name));
        },
        error: validation.errors[name]?.message,
      };
    },
    [data, validation.errors]
  );

  return {
    errors,
    isValid,
    data,
    register,
    touched,
  };
}
