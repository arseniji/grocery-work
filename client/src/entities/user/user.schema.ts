import { validator } from "@/lib/validators";

export const UserSchema = validator.object({
  login: validator.string(),
});
