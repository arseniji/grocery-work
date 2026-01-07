import { validator, type Infer } from "@/lib/validators";

export const UserSchema = validator.object({
  login: validator.string(),
  password: validator.number(),
});

export type UserType = Infer<typeof UserSchema>;
