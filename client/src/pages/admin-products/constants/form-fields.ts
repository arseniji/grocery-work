export const PRODUCT_FORM_FIELDS = [
  [
    { name: "productName", label: "Название продукта", type: "text" },
    { name: "price", label: "Цена", type: "number" },
  ],
  [
    { name: "rating", label: "Рейтинг", type: "text" },
    { name: "category", label: "Категория", type: "text" },
    { name: "measurementUnit", label: "Единица измерения", type: "text" },
  ],
  [{ name: "quantity", label: "Количество", type: "number" }],
  [{ name: "description", label: "Описание", type: "text" }],
] as const;
