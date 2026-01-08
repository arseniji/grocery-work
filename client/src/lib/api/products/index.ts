import { createEndpoint } from "../core";
import type { ProductRes } from "./types";

class ProductsApi {
  public async top(count: number) {
    return createEndpoint<ProductRes>(
      "v1/products/top",
      "GET"
    )({ sizeTop: count });
  }
}

export const productsApi = new ProductsApi();
