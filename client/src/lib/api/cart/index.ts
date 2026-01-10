import { createEndpoint } from "../core";
import type { AddManyReq, AddProductRes } from "./types";

class CartApi {
  public addOne(id: number) {
    return createEndpoint<AddProductRes>(`v1/cart/add-one/${id}`, "POST")();
  }

  public addMany = createEndpoint<AddProductRes, AddManyReq>(
    "v1/cart/add",
    "POST"
  );
}

export const cartApi = new CartApi();
