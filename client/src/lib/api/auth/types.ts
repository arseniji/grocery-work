import type { ShortUser, UserClient } from "@/entities/user/types";
import type { SessionType } from "@/shared/types/global";

export interface RegisterRes {
  success: boolean;
  user: UserClient;
  session: SessionType;
}

export interface LoginRes {
  success: boolean;
  session: SessionType;
  user: ShortUser;
}
