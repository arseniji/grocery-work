import type { UserType } from "@/entities/user/user.schema";
import { createEndpoint } from "../core";
import type { RegisterRes } from "./types";

class AuthApi {
  public register = createEndpoint<RegisterRes, UserType>(
    "v1/register",
    "POST"
  );
}

export const authApi = new AuthApi();
