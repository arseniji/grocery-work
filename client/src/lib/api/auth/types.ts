import type { UserClient } from "@/entities/user/user.schema";
import type { SessionType } from "@/shared/types/global";

export interface RegisterRes {
  success: boolean;
  user: UserClient;
  session: SessionType;
}
