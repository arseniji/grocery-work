import { flattenKeys } from "@/lib/commons";
import type { ComboBoxOption } from "@/shared/ui/combobox";

export const getSearchOptions = (
  obj?: Record<string, any>,
): ComboBoxOption[] => {
  if (!obj) return [];
  const keys = flattenKeys(obj).filter(
    (key) => !key.includes("metadata") && !key.includes("success"),
  );

  const options: ComboBoxOption[] = [];

  keys.forEach((key) => {
    options.push({
      value: `${key}`,
      label: `${key}`,
    });
  });

  return options;
};
