import { flattenKeys, snakeCase } from "@/lib/commons";
import type { ComboBoxOption } from "@/shared/ui/combobox";

export const getSortingOptions = (
  obj?: Record<string, any>,
): ComboBoxOption[] => {
  if (!obj) return [];
  const keys = flattenKeys(obj)
    .filter((key) => !key.includes("metadata") && !key.includes("success"))
    .map((key) => {
      if (key.includes(".")) {
        return key.split(".").at(-1);
      }
      return snakeCase(key);
    });

  const options: ComboBoxOption[] = [];

  keys.forEach((key) => {
    options.push({
      value: `${key}:asc`,
      label: `${key} (По возрастанию)`,
    });
    options.push({
      value: `${key}:desc`,
      label: `${key} (По убыванию)`,
    });
  });

  return options;
};
