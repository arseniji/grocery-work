import { createEndpoint } from "../core";
import type { GetUsersRes, GetProductsRes, GetProductRes } from "./types";

class AdminApi {
  public async getUsers(
    page: number = 1,
    pageSize: number = 10,
    sort?: string,
    search?: string
  ) {
    return createEndpoint<GetUsersRes>(
      "v1/admin/profile",
      "GET"
    )({ page, pageSize, sort, search });
  }

  public async addUser(data: {
    login: string;
    password: string;
    phone: string;
    firstname: string;
    lastname: string;
    patronymic: string;
    role: string;
  }) {
    return createEndpoint("v1/admin/profile", "POST")(data);
  }

  public async getUser(userId: number) {
    return createEndpoint(`v1/admin/profile/${userId}`, "GET")();
  }

  public async updateUser(
    userId: number,
    data: {
      login: string;
      phone: string;
      firstname: string;
      lastname: string;
      patronymic: string;
      role: string;
    }
  ) {
    return createEndpoint(`v1/admin/profile/${userId}`, "PUT")(data);
  }

  public async deleteUser(userId: number) {
    return createEndpoint(`v1/admin/profile/${userId}`, "DELETE")();
  }

  public async getProducts(
    page: number = 1,
    pageSize: number = 10,
    sort?: string,
    search?: string
  ) {
    return createEndpoint<GetProductsRes>(
      "v1/admin/product",
      "GET"
    )({ page, pageSize, sort, search });
  }

  public async addProduct(data: {
    product_name: string;
    price: number;
    rating: string;
    category: string;
    description: string;
    measurement_unit: string;
    quantity: number;
  }) {
    return createEndpoint("v1/admin/product", "POST")(data);
  }

  public async getProduct(productId: number) {
    return createEndpoint<GetProductRes>(
      `v1/admin/product/${productId}`,
      "GET"
    )();
  }

  public async updateProduct(
    productId: number,
    data: {
      product_name: string;
      price: number;
      rating: string;
      category: string;
      description: string;
      measurement_unit: string;
      quantity: number;
    }
  ) {
    return createEndpoint(`v1/admin/product/${productId}`, "PUT")(data);
  }

  public async deleteProduct(productId: number) {
    return createEndpoint(`v1/admin/product/${productId}`, "DELETE")();
  }
}

export const adminApi = new AdminApi();
