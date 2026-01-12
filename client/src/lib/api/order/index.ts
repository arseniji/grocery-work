import { createEndpoint } from "../core";
import type { CreateOrderRes, CreateOrderReq } from "./types";

class OrderApi {
  public create = createEndpoint<CreateOrderRes, CreateOrderReq>(
    "v1/order/create",
    "POST"
  );
}

export const orderApi = new OrderApi();
