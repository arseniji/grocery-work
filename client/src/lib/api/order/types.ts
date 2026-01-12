import type { IOrder } from "@/entities/order/types";

export interface CreateOrderReq {
  description: string;
}

export interface CreateOrderRes {
  success: boolean;
  timestamp: string;
}

export interface GetOrdersQueryParams {
  page: string;
  page_size: string;
  sort?: string;
  status?: string;
  search?: string;
}

export interface GetOrdersRes {
  success: boolean;
  orders: IOrder[];
  meta: {
    currentPage: string;
    pageSize: string;
    totalCount: number;
    totalPages: number;
  };
}
