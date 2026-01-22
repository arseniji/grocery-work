import { validator, type Infer } from "@/lib/validators";

export const AdminProductAddSchema = validator.object({
  productName: validator
    .string()
    .min(1, { message: "Название продукта обязательно" })
    .max(100, { message: "Максимальная длина 100" }),
  price: validator
    .number()
    .min(0, { message: "Цена должна быть положительной" }),
  rating: validator.string().min(1, { message: "Рейтинг обязателен" }),
  category: validator.string().min(1, { message: "Категория обязательна" }),
  description: validator
    .string()
    .min(1, { message: "Описание обязательно" })
    .max(500, { message: "Максимальная длина 500" }),
  measurementUnit: validator
    .string()
    .min(1, { message: "Единица измерения обязательна" }),
  quantity: validator
    .number()
    .min(0, { message: "Количество должно быть положительным" }),
});

export const AdminProductEditSchema = validator.object({
  productName: validator
    .string()
    .min(1, { message: "Название продукта обязательно" })
    .max(100, { message: "Максимальная длина 100" }),
  price: validator
    .number()
    .min(0, { message: "Цена должна быть положительной" }),
  rating: validator.string().min(1, { message: "Рейтинг обязателен" }),
  category: validator.string().min(1, { message: "Категория обязательна" }),
  description: validator
    .string()
    .min(1, { message: "Описание обязательно" })
    .max(500, { message: "Максимальная длина 500" }),
  measurementUnit: validator
    .string()
    .min(1, { message: "Единица измерения обязательна" }),
  quantity: validator
    .number()
    .min(0, { message: "Количество должно быть положительным" }),
});

export type AdminProductAddType = Infer<typeof AdminProductAddSchema>;
export type AdminProductEditType = Infer<typeof AdminProductEditSchema>;
