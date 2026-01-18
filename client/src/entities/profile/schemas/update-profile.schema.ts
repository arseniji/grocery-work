import { validator } from "@/lib/validators";

export const UpdateProfileSchema = validator.object({
  firstname: validator.string(),
  lastname: validator.string(),
  login: validator.string(),
  patronymic: validator.string(),
  phone: validator.string(),
});
