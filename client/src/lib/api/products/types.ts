import type { Category, Product } from "@/entities/product/types";

export interface ProductRes {
  success: boolean;
  products: Product[];
  meta: {
    totalPages: number;
    totalCount: number;
  };
}

export interface CategoryRes {
  success: boolean;
  items: Category[];
  total_items: number;
}
