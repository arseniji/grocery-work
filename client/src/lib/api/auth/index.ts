import type { UserRegisterType } from "@/entities/user/schemas/user-register.schema";
import { createEndpoint } from "../core";
import type { LoginRes, LogoutRes, RegisterRes } from "./types";
import type { UserLoginType } from "@/entities/user/schemas/user-login.schema";

class AuthApi {
  public register = createEndpoint<RegisterRes, UserRegisterType>(
    "v1/register",
    "POST"
  );

  public login = createEndpoint<LoginRes, UserLoginType>("v1/login", "POST");

  public logout = createEndpoint<LogoutRes>("v1/logout", "DELETE", {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
}

export const authApi = new AuthApi();
