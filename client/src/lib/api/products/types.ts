import type { Category, Product } from "@/entities/product/types";

export interface ProductRes {
  success: boolean;
  products: Product[];
  meta: {
    isTopList: boolean;
    size: string;
  };
}

export interface CategoryRes {
  success: boolean;
  items: Category[];
  total_items: number;
}
