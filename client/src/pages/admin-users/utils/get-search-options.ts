import type { ComboBoxOption } from "@/shared/ui/combobox";

export const getSearchOptions = (
  obj?: Record<string, any>
): ComboBoxOption[] => {
  if (!obj) return [];
  const keys = Object.keys(obj).filter((key) => key !== "metadata");

  const options: ComboBoxOption[] = [];

  keys.forEach((key) => {
    options.push({
      value: `${key}`,
      label: `${key}`,
    });
  });

  return options;
};
