import { createEndpoint } from "../core";

class ProductsApi {
  public async top(count: number) {
    return createEndpoint("v1/products/top", "GET")({ sizeTop: count });
  }
}

export const productsApi = new ProductsApi();
