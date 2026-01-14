import { useState, useCallback, useMemo } from "react";
import type { ObjectSchema } from "../validators/base-schemas/object-schema";
import type { Schema } from "../validators/base-schemas/schema";

export interface UseFormOptions<
  SchemaShape extends Record<string, Schema<any>>
> {
  defaultValues?: Partial<Record<keyof SchemaShape, any>>;
}

export interface RegisterReturn {
  name: string;
  value: any;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export function useForm<SchemaShape extends Record<string, Schema<any>>>(
  schema: ObjectSchema<SchemaShape>,
  options?: UseFormOptions<SchemaShape>
) {
  const [data, setDataState] = useState<
    Partial<Record<keyof SchemaShape, any>>
  >(options?.defaultValues || {});

  const [touched, setTouched] = useState<Set<keyof SchemaShape>>(new Set());

  const validation = useMemo(() => schema.safeParse(data), [schema, data]);

  const errors = validation.errors;

  const isValid = validation.success;

  const setData = useCallback(
    (newData: Partial<Record<keyof SchemaShape, any>>) => {
      setDataState((prev) => ({ ...prev, ...newData }));
    },
    []
  );

  const register = useCallback(
    (name: keyof SchemaShape): RegisterReturn => {
      return {
        name: name as string,
        value: data[name] || "",
        onChange: (value: string) => {
          setDataState((prev) => ({ ...prev, [name]: value }));
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
    setData,
  };
}
