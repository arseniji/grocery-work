import { createEndpoint } from "../core";
import type { GetCardRes, AddManyReq, AddProductRes } from "./types";

class CartApi {
  public addOne(id: number) {
    return createEndpoint<AddProductRes>(`v1/cart/add-one/${id}`, "POST")();
  }

  public addMany = createEndpoint<AddProductRes, AddManyReq>(
    "v1/cart/add",
    "POST"
  );

  public removeOne(id: number) {
    return createEndpoint<AddProductRes>(
      `v1/cart/remove-one/${id}`,
      "DELETE"
    )();
  }

  public remove(id: number) {
    return createEndpoint<AddProductRes>(`v1/cart/remove/${id}`, "DELETE")();
  }

  public get = createEndpoint<GetCardRes>("v1/cart", "GET");
}

export const cartApi = new CartApi();
