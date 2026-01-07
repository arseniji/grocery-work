import { validator, type Infer } from "@/lib/validators";
import { loginReg, nameReg, passwordReg, phoneReg } from "../constants/regexp";

export const UserRegisterSchema = validator.object({
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
  phone: validator.string().regexp(phoneReg, { message: "Некоректный номер" }),
  firstname: validator
    .string()
    .min(2, { message: "Минимальная длинна 2" })
    .max(50, { message: "Максимальная длинна 50" })
    .regexp(nameReg, {
      message: "Может содержать только буквы, дефисы и пробелы",
    }),
  lastname: validator
    .string()
    .min(2, { message: "Минимальная длинна 2" })
    .max(50, { message: "Максимальная длинна 50" })
    .regexp(nameReg, {
      message: "Может содержать только буквы, дефисы и пробелы",
    }),
  patronymic: validator
    .string()
    .min(2, { message: "Минимальная длинна 2" })
    .max(50, { message: "Максимальная длинна 50" })
    .regexp(nameReg, {
      message: "Может содержать только буквы, дефисы и пробелы",
    }),
});

export type UserRegisterType = Infer<typeof UserRegisterSchema>;
