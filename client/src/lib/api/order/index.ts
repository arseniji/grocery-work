import { createEndpoint } from "../core";
import type {
  CreateOrderRes,
  CreateOrderReq,
  GetOrdersQueryParams,
  GetOrdersRes,
  GetOrderStatusesRes,
  GetOrderDetailsRes,
} from "./types";

class OrderApi {
  public create = createEndpoint<CreateOrderRes, CreateOrderReq>(
    "v1/order/create",
    "POST"
  );

  public async get(params: GetOrdersQueryParams) {
    const query = new URLSearchParams(
      params as unknown as Record<string, string>
    );
    return createEndpoint<GetOrdersRes>(`v1/order?${query}`, "GET")();
  }

  public getStatuses = createEndpoint<GetOrderStatusesRes>(
    "v1/order/status_collection",
    "GET"
  );

  public getDetails(id: number) {
    return createEndpoint<GetOrderDetailsRes>(`v1/order/${id}`, "GET")();
  }
}

export const orderApi = new OrderApi();
