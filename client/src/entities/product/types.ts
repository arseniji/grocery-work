export interface Product {
  success: boolean;
  id: number;
  productName: string;
  price: string;
  rating: string;
  category: string;
  details: {
    description: string;
    unit: string;
    imageUrl: string;
    quantity: number;
  };
  timestamps: {
    created_at: string;
    updated_at: string;
  };
  metadata: object;
}

export interface Category {
  success: boolean;
  categoryName: string;
}
