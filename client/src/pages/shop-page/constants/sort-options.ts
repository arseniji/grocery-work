import type { ComboBoxOption } from "@/shared/ui/combobox";

export const sortOptions: ComboBoxOption[] = [
  {
    value: "price:asc",
    label: "По цене (ASC)",
  },
  {
    value: "price:desc",
    label: "По цене (DESC)",
  },
  {
    value: "rating:asc",
    label: "По рейтингу (ASC)",
  },
  {
    value: "rating:desc",
    label: "По рейтингу (DESC)",
  },
];
