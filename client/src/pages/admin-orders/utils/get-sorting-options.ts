import type { ShortOrder } from "@/lib/api/admin/types";

export const getSortingOptions = (order?: ShortOrder) => {
  if (!order) return [];
  return Object.keys(order).map((key) => ({
    label: key,
    value: key,
  }));
};
