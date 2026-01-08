import type { Product } from "@/entities/product/types";
import { createEndpoint } from "../core";
import type { ProductRes } from "./types";

class ProductsApi {
  public async top(count: number) {
    return createEndpoint<ProductRes>(
      "v1/products/top",
      "GET"
    )({ sizeTop: count });
  }

  public async get(
    page: number,
    pageSize: number,
    sort?: string,
    category?: string,
    search?: string
  ) {
    return createEndpoint<ProductRes>(
      "v1/products",
      "GET"
    )({ page, pageSize, sort, category, search });
  }

  public async getById(id: number) {
    return createEndpoint<Product>(`v1/products/${id}`, "GET")();
  }
}

export const productsApi = new ProductsApi();
