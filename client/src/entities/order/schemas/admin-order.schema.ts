import { validator, type Infer } from "@/lib/validators";

export const AdminOrderAddSchema = validator.object({
  description: validator
    .string()
    .min(1, { message: "Описание заказа обязательно" })
    .max(500, { message: "Максимальная длина 500" }),
  status: validator.string().min(1, { message: "Статус обязателен" }),
});

export const AdminOrderEditSchema = validator.object({
  description: validator
    .string()
    .min(1, { message: "Описание заказа обязательно" })
    .max(500, { message: "Максимальная длина 500" }),
  status: validator.string().min(1, { message: "Статус обязателен" }),
});

export type AdminOrderAddType = Infer<typeof AdminOrderAddSchema>;
export type AdminOrderEditType = Infer<typeof AdminOrderEditSchema>;
