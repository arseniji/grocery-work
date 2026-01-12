import { createEndpoint } from "../core";
import type { CreateOrderRes, CreateOrderReq } from "./types";

class OrderApi {
  public create = createEndpoint<CreateOrderRes, CreateOrderReq>(
    "v1/order/create",
    "POST"
  );

  public get = createEndpoint("v1/order?page=1&page_size=20", "GET");
}

export const orderApi = new OrderApi();
