import { createEndpoint } from "../core";
import type { GetUsersRes } from "./types";

class AdminApi {
  public getUsers = createEndpoint<GetUsersRes>("v1/admin/profile", "GET");
}

export const adminApi = new AdminApi();
