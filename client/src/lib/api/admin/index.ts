import type {
  AdminProductAddType,
  AdminProductEditType,
} from "@/entities/product/schemas";
import { createEndpoint } from "../core";
import type {
  GetUsersRes,
  GetProductsRes,
  GetProductRes,
  GetOrdersRes,
  GetOrderDetailsRes,
  GetReport,
} from "./types";

class AdminApi {
  public async getUsers(
    page: number = 1,
    pageSize: number = 10,
    sort?: string,
    search?: string,
  ) {
    return createEndpoint<GetUsersRes>(
      "v1/admin/profile",
      "GET",
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
    },
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
    search?: string,
  ) {
    return createEndpoint<GetProductsRes>(
      "v1/admin/product",
      "GET",
    )({ page, pageSize, sort, search });
  }

  public async addProduct(data: AdminProductAddType) {
    return createEndpoint("v1/admin/product", "POST")(data);
  }

  public async getProduct(productId: number) {
    return createEndpoint<GetProductRes>(
      `v1/admin/product/${productId}`,
      "GET",
    )();
  }

  public async updateProduct(productId: number, data: AdminProductEditType) {
    return createEndpoint(`v1/admin/product/${productId}`, "PUT")(data);
  }

  public async deleteProduct(productId: number) {
    return createEndpoint(`v1/admin/product/${productId}`, "DELETE")();
  }

  public async getOrders(
    page: number = 1,
    pageSize: number = 10,
    sort?: string,
    search?: string,
  ) {
    return createEndpoint<GetOrdersRes>(
      "v1/admin/order",
      "GET",
    )({ page, pageSize, sort, search });
  }

  public async addOrder(data: { description: string; status: string }) {
    return createEndpoint("v1/admin/order", "POST")(data);
  }

  public async updateOrder(
    orderId: number,
    userId: number,
    data: {
      description: string;
      status: string;
    },
  ) {
    return createEndpoint(
      `v1/admin/order/user/${userId}/order/${orderId}`,
      "PUT",
    )(data);
  }

  public async getOrderDetails(userId: number, orderId: number) {
    return createEndpoint<GetOrderDetailsRes>(
      `v1/admin/order/user/${userId}/order/${orderId}`,
      "GET",
    )();
  }

  public async addOrderItem(
    userId: number,
    orderId: number,
    productId: number,
    quantity: number,
  ) {
    return createEndpoint<{
      success: boolean;
      error?: {
        message: string;
      };
    }>(
      `v1/admin/order/user/${userId}/order/${orderId}/product/${productId}`,
      "POST",
    )({ quantity });
  }

  public async removeOrderItem(
    userId: number,
    orderId: number,
    productId: number,
    quantity: number,
  ) {
    return createEndpoint<{ success: boolean }, { quantity: number }>(
      `v1/admin/order/user/${userId}/order/${orderId}/product/${productId}`,
      "DELETE",
    )({ quantity: quantity });
  }

  public async deleteOrder(orderId: number) {
    return createEndpoint(`v1/admin/order/${orderId}`, "DELETE")();
  }

  public async exportOrders(format: "json" | "xml" = "json") {
    return createEndpoint(
      `v1/admin/data/export/orders`,
      "GET",
    )({ file_format: format });
  }

  public async exportProducts(format: "json" | "xml" = "json") {
    return createEndpoint(
      `v1/admin/data/export/products`,
      "GET",
    )({ file_format: format });
  }

  public async exportUsers(format: "json" | "xml" = "json") {
    return createEndpoint(
      `v1/admin/data/export/user`,
      "GET",
    )({ file_format: format });
  }

  public async importOrders(file: File, format: "json" | "xml" = "json") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_format", format);
    return createEndpoint(`v1/admin/data/import/orders`, "POST")(formData);
  }

  public async importProducts(file: File, format: "json" | "xml" = "json") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_format", format);
    return createEndpoint(`v1/admin/data/import/products`, "POST")(formData);
  }

  public async importUsers(file: File, format: "json" | "xml" = "json") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_format", format);
    return createEndpoint(`v1/admin/data/import/user`, "POST")(formData);
  }

  public undo = createEndpoint("v1/admin/command/undo", "POST");

  public history = createEndpoint("v1/admin/command/history", "GET");

  public reports = createEndpoint<GetReport, object, { domain: "products" }>(
    "v1/admin/report?domain={domain}",
    "GET",
  );
}

export const adminApi = new AdminApi();
