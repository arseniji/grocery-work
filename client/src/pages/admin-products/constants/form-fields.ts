export const LOCATION_OPTIONS = [
  { value: "in_store", label: "В магазине" },
  { value: "in_warehouse", label: "На складе" },
];

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
  [
    { name: "barcode", label: "Баркод", type: "text" },
    {
      name: "location",
      label: "Местонахождение",
      type: "select",
      options: LOCATION_OPTIONS,
    },
  ],
  [{ name: "description", label: "Описание", type: "text" }],
];
