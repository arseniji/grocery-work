import { validator, type Infer } from "@/lib/validators";
import { loginReg, passwordReg } from "../constants/regexp";

export const UserLoginSchema = validator.object({
  login: validator
    .string()
    .min(3, { message: "Минимальная длинна 3" })
    .max(50, { message: "Максимальная длина 50" })
    .regexp(loginReg, {
      message: "Может содержать только буквы, цифры и '_'",
    }),
  password: validator
    .string()
    .min(6, { message: "Минимальная длинна 6" })
    .max(72, { message: "Максимальная длинна 72" })
    .regexp(passwordReg, {
      message:
        "Должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру",
    }),
});

export type UserLoginType = Infer<typeof UserLoginSchema>;
