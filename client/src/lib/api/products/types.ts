import type { Product } from "@/entities/product/types";

export interface ProductRes {
  success: boolean;
  products: Product[];
  meta: {
    isTopList: boolean;
    size: string;
  };
}
