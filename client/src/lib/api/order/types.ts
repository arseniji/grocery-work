import type { IOrder, IOrderStatus } from "@/entities/order/types";
import type { Product } from "@/entities/product/types";

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
    totalItems: number;
    totalPrice: string;
    itemsCount: number;
  };
  meta: {
    metadata: {
      orderSource: string;
    };
  };
}

export interface OrderProduct extends Omit<Product, "metadata"> {
  metadata: {
    orderSource: string;
    orderDetails: {
      quantityInOrder: number;
      totalPriceForItem: string;
      orderedAt: string;
    };
  };
}
