import { createEndpoint } from "../core";

class AuthApi {
  public register = createEndpoint("v1/register", "POST");
}

export const authApi = new AuthApi();
