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
}

export const adminApi = new AdminApi();
