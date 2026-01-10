import type { Product } from "@/entities/product/types";

export interface AddProductRes {
  success: boolean;
}

export interface AddManyReq {
  productId: number;
  quantity: number;
}

export interface GetCardRes {
  success: boolean;
  items: Product[];
  summary: {
    totalItems: number;
    totalPrice: string;
    uniqueProducts: number;
  };
}
