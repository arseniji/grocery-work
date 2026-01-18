export interface IOrder {
  description: string;
  id: number;
  status: "processing" | "";
  success: true;
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
  metadata: OrderMeta;
}

export interface OrderMeta {
  filters: object;
}

export interface IOrderStatus {
  success: boolean;
  statusName: string;
}
