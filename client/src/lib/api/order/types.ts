import type { IOrder, IOrderStatus } from "@/entities/order/types";

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

export interface GetOrderStatusesRes {
  success: boolean;
  items: IOrderStatus[];
  totalItems: number;
}

export interface GetOrderDetailsRes {
  success: boolean;
  order: IOrder;
  products: OrderProduct[];
  summary: {
    total_items: number;
    total_price: string;
    items_count: number;
  };
  meta: {
    metadata: {
      order_source: string;
    };
  };
}

export interface OrderProduct extends Omit<IOrder, "metadata"> {
  metadata: {
    order_source: string;
    order_details: {
      quantity_in_order: number;
      total_price_for_item: string;
      ordered_at: string;
    };
  };
}
