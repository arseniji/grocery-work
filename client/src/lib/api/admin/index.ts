import { createEndpoint } from "../core";
import type { GetUsersRes } from "./types";

class AdminApi {
  public async getUsers(
    page: number = 1,
    pageSize: number = 10,
    sort?: string
  ) {
    return createEndpoint<GetUsersRes>(
      "v1/admin/profile",
      "GET"
    )({ page, pageSize, sort });
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
}

export const adminApi = new AdminApi();
