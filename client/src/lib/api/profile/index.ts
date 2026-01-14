import { createEndpoint } from "../core";
import type { GetProfileRes } from "./types";

class ProfileApi {
  public get = createEndpoint<GetProfileRes>("v1/profile/me", "GET");

  public delete = createEndpoint("v1/profile/me", "DELETE");

  public update = createEndpoint("v1/profile/me", "PATCH");
}

export const profileApi = new ProfileApi();
