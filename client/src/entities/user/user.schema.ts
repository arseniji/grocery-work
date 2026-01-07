import { validator } from "@/lib/validators";

export const UserSchema = validator.string({
  message: "Логин должен быть строкой",
});
