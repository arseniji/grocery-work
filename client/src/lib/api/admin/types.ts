import type { IRole } from "@/entities/profile/types";

export interface GetMeta {
  currentPage: number;
  filters: object;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ShortUser {
  firstname: string;
  lastname: string;
  login: string;
  role: IRole;
  userId: number;
}

export interface GetUsersRes {
  success: boolean;
  meta: GetMeta;
  users: ShortUser[];
}

export interface ShortProduct {
  id: number;
  name: string;
  price: string;
  category: string;
}

export interface GetProductsRes {
  success: boolean;
  meta: GetMeta;
  products: ShortProduct[];
}
