import type { ComboBoxOption } from "@/shared/ui/combobox";

export const getSortingOptions = (
  obj?: Record<string, any>
): ComboBoxOption[] => {
  if (!obj) return [];
  const keys = Object.keys(obj).filter((key) => key !== "metadata");

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
